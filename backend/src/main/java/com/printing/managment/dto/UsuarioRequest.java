package com.printing.managment.dto;

import com.printing.managment.model.Rol;

public record UsuarioRequest(
        String nombre,
        String email,
        String password,
        Rol rol
) {
}
