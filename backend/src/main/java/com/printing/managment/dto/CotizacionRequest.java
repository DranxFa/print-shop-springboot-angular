package com.printing.managment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record CotizacionRequest(
        @NotNull(message = "El ID de material es obligatorio")
        Long idMaterial,

        Long idAcabado,

        @NotNull(message = "El ancho es obligatorio")
        @Positive(message = "El ancho debe ser un valor positivo")
        BigDecimal ancho,

        @NotNull(message = "El alto es obligatorio")
        @Positive(message = "El alto debe ser un valor positivo")
        BigDecimal alto,

        @Positive(message = "La cantidad debe ser mayor a cero")
        int cantidad
) {}
