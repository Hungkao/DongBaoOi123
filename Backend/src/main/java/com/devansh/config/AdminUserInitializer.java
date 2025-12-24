package com.devansh.config;

import com.devansh.model.User;
import com.devansh.model.enums.Role;
import com.devansh.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class AdminUserInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Create a default admin account on application startup if it doesn't exist.
     * email: admin@gmail.com
     * password: 123456
     */
    @Bean
    public CommandLineRunner createDefaultAdmin() {
        return args -> {
            String adminEmail = "admin@gmail.com";

            // If admin already exists, do nothing
            if (userRepository.findByEmail(adminEmail).isPresent()) {
                return;
            }

            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("123456"))
                    .fullname("Administrator")
                    .createdAt(LocalDateTime.now())
                    .role(Role.ADMIN)
                    .build();

            // Mark email as verified so admin can login directly without OTP if needed
            admin.setEmailVerified(true);

            userRepository.save(admin);
        };
    }
}



