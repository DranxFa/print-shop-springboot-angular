package com.printing.managment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record PagoRequest(
        @NotNull(message = "El monto es obligatorio")
        @Positive(message = "El monto debe ser un valor positivo")
        BigDecimal monto,

        @NotBlank(message = "El método de pago es obligatorio")
        String metodo
) {}
