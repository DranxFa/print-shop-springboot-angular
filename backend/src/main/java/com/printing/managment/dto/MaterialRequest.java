package com.printing.managment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record MaterialRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotNull(message = "El precio por M2 es obligatorio")
        @Positive(message = "El precio por M2 debe ser un valor positivo")
        BigDecimal precioM2,

        @NotBlank(message = "La unidad de medida es obligatoria")
        String unidad
) {}
