package com.printing.managment.dto;

public record LoginRequest(
        String email,
        String password
) {
}
