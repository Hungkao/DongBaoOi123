package com.devansh.controller;

import com.devansh.exception.TokenInvalidException;
import com.devansh.exception.UserException;
import com.devansh.request.UserUpdateRequest;
import com.devansh.response.UserDto;
import com.devansh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getMyDetails(@RequestHeader("Authorization") String token) throws TokenInvalidException, UserException {
        return ResponseEntity.ok(userService.getMyDetails(token));
    }

    @PutMapping
    public ResponseEntity<UserDto> updateMyDetails(@RequestHeader("Authorization") String token, @RequestBody UserUpdateRequest request) throws UserException, TokenInvalidException {
        return ResponseEntity.ok(userService.updateMyDetails(token, request));
    }

}
