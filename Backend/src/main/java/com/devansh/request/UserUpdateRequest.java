package com.devansh.request;

public record UserUpdateRequest(
        String fullname,
        String phoneNumber,
        String address
) {
}
