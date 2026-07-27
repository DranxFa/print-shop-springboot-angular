package com.printing.managment.dto;

public record ClienteResponse(
        Long id,
        String nombre,
        String telefono,
        String rucDni
) {}
