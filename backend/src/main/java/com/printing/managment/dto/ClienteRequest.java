package com.printing.managment.dto;

import jakarta.validation.constraints.NotBlank;

public record ClienteRequest(
        @NotBlank(message = "El nombre del cliente es obligatorio")
        String nombre,

        String telefono,

        @NotBlank(message = "El RUC o DNI es obligatorio")
        String rucDni
) {}
