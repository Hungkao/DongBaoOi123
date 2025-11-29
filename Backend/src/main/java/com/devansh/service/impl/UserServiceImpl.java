package com.devansh.service.impl;

import com.devansh.config.JwtService;
import com.devansh.exception.TokenInvalidException;
import com.devansh.exception.UserException;
import com.devansh.model.User;
import com.devansh.repo.UserRepository;
import com.devansh.request.UserUpdateRequest;
import com.devansh.response.UserDto;
import com.devansh.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public User findByJwtToken(String token) throws UserException, TokenInvalidException {
        token = token.substring(7);
        String email = jwtService.extractUsername(token);
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException("User not found with email: " + email));
        return user;
    }

    @Override
    public UserDto getMyDetails(String token) throws UserException, TokenInvalidException {
        User user = findByJwtToken(token);
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullname(user.getFullname())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .address(user.getAddress())
                .build();
    }

    @Override
    public UserDto updateMyDetails(String token, UserUpdateRequest request) throws UserException, TokenInvalidException {
        User user = findByJwtToken(token);
        if (request.address() != null) {
            user.setAddress(request.address());
        }
        if (request.phoneNumber() != null) {
            user.setPhoneNumber(request.phoneNumber());
        }
        if (request.fullname() != null) {
            user.setFullname(request.fullname());
        }
        User updatedUser = userRepository.save(user);
        return UserDto.builder()
                .id(updatedUser.getId())
                .email(updatedUser.getEmail())
                .fullname(updatedUser.getFullname())
                .phoneNumber(updatedUser.getPhoneNumber())
                .role(updatedUser.getRole())
                .address(updatedUser.getAddress())
                .build();
    }

}































