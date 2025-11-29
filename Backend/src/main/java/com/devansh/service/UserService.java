package com.devansh.service;

import com.devansh.exception.TokenInvalidException;
import com.devansh.exception.UserException;
import com.devansh.model.User;
import com.devansh.request.UserUpdateRequest;
import com.devansh.response.UserDto;

public interface UserService {

    User findByJwtToken(String token) throws UserException, TokenInvalidException;
    UserDto getMyDetails(String token) throws UserException, TokenInvalidException;
    UserDto updateMyDetails(String token, UserUpdateRequest request) throws UserException, TokenInvalidException;
}
