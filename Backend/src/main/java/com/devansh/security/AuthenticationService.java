package com.devansh.security;

import com.devansh.config.JwtService;
import com.devansh.exception.OtpException;
import com.devansh.exception.TokenInvalidException;
import com.devansh.exception.UserAlreadyExistException;
import com.devansh.exception.UserException;
import com.devansh.model.User;
import com.devansh.model.enums.Role;
import com.devansh.repo.UserRepository;
import com.devansh.request.auth.*;
import com.devansh.response.AuthenticationResponse;
import com.devansh.service.EmailService;
import com.google.common.cache.LoadingCache;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@AllArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final LoadingCache oneTimePasswordCache;
    private final EmailService emailService;

    // =========================
    // REGISTER
    // =========================
    public AuthenticationResponse register(RegisterRequest request) throws UserAlreadyExistException {

        if (request.getRole() == null) {
            request.setRole(Role.USER);
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistException("Email already in use: " + request.getEmail());
        }

        var user = User.builder()
                .fullname(request.getFullname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .createdAt(LocalDateTime.now())
                .isEmailVerified(false)
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // =========================
    // LOGIN (ADMIN + USER)
    // =========================
    public ResponseEntity authenticate(AuthenticationRequest request) throws UserException {

        // =========================
        // HARD-CODED ADMIN LOGIN (bypass AuthenticationManager)
        // =========================
        if ("admin@gmail.com".equalsIgnoreCase(request.getEmail())
                && "123456".equals(request.getPassword())) {

            User user = userRepository.findByEmail("admin@gmail.com")
                    .orElseThrow(() -> new UserException("Admin user not found"));

            String accessToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            return ResponseEntity.ok(
                    AuthenticationResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(refreshToken)
                            .build()
            );
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserException(request.getEmail() + " does not exist"));

        // 🔥 FIX QUAN TRỌNG:
        // USER -> dùng OTP
        // ADMIN -> KHÔNG dùng OTP
        if (user.isEmailVerified() && user.getRole() != Role.ADMIN) {
            sendOtp(user, "2FA: Request to log in to your account");
            return ResponseEntity.ok(getOtpSendMessage());
        }

        // ✅ ADMIN (và user chưa bật 2FA) nhận token ngay
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build()
        );
    }

    // =========================
    // OTP HELPERS
    // =========================
    private Map<String, Object> getOtpSendMessage() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "OTP sent successfully to your registered email. Verify using /verify-otp");
        return response;
    }

    private void sendOtp(User user, String subject) {

        int otp = new Random().ints(1, 100000, 999999).sum();

        Map<String, Object> data = new HashMap<>();
        data.put("otp", otp);
        data.put("fullname", user.getFullname());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        data.put("password", user.getPassword());

        oneTimePasswordCache.put(user.getEmail(), data);

        System.out.println("OTP generated: " + otp);

        CompletableFuture.supplyAsync(() -> {
            emailService.sendEmail(user.getEmail(), subject, "OTP: " + otp);
            return HttpStatus.OK;
        });
    }

    // =========================
    // VERIFY OTP
    // =========================
    public ResponseEntity verifyOtp(OtpVerificationRequest request)
            throws ExecutionException, OtpException {

        Object cached = oneTimePasswordCache.get(request.getEmailId());

        if (!(cached instanceof Map)) {
            throw new OtpException("No OTP found for email: " + request.getEmailId());
        }

        Map<String, Object> data = (Map<String, Object>) cached;
        int otp = (Integer) data.get("otp");

        if (otp != request.getOneTimePassword()) {
            throw new OtpException("Invalid OTP");
        }

        if (request.getContext().equals(OtpContext.LOGIN)) {

            User user = userRepository.findByEmail(request.getEmailId())
                    .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

            oneTimePasswordCache.invalidate(user.getEmail());

            String accessToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            return ResponseEntity.ok(
                    AuthenticationResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(refreshToken)
                            .build()
            );
        }

        throw new OtpException("OTP context not supported");
    }

    // =========================
    // REFRESH TOKEN
    // =========================
    public AuthenticationResponse refreshToken(String refreshToken)
            throws TokenInvalidException {

        if (refreshToken == null || !refreshToken.startsWith("Bearer ")) {
            throw new TokenInvalidException("Invalid token");
        }

        refreshToken = refreshToken.substring(7);
        String userEmail = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException(userEmail));

        if (!jwtService.validateToken(refreshToken, user)) {
            throw new TokenInvalidException("Refresh token invalid");
        }

        String accessToken = jwtService.generateToken(user);
        return new AuthenticationResponse(accessToken, refreshToken);
    }

    // =========================
    // RESET PASSWORD
    // =========================
    public ResponseEntity resetPassword(ResetPasswordRequest request)
            throws UserException {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UserException("User not found"));

        sendOtp(user, "Reset Password");
        return ResponseEntity.ok(getOtpSendMessage());
    }

    // =========================
    // ENABLE 2FA
    // =========================
    public ResponseEntity enableTwoFactAuth(AuthenticationRequest request)
            throws UserException {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserException("User not found"));

        sendOtp(user, "Enable Two Factor Authentication");
        return ResponseEntity.ok(getOtpSendMessage());
    }
}
