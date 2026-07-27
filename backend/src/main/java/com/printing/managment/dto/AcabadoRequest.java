package com.printing.managment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record AcabadoRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotNull(message = "El costo fijo es obligatorio")
        @PositiveOrZero(message = "El costo fijo debe ser mayor o igual a cero")
        BigDecimal costoFijo,

        @NotNull(message = "El costo por m2 es obligatorio")
        @PositiveOrZero(message = "El costo por m2 debe ser mayor o igual a cero")
        BigDecimal costoM2
) {}
