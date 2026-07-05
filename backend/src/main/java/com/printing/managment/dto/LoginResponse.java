package com.printing.managment.dto;

import com.printing.managment.model.Rol;

public record LoginResponse(
        String token,
        String nombre,
        Rol rol
) {
}
