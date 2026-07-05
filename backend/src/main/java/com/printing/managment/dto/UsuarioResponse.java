package com.printing.managment.dto;

import com.printing.managment.model.Rol;

public record UsuarioResponse(
        Long id,
        String nombre,
        String email,
        Rol rol
) {
}
