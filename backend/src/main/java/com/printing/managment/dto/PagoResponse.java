package com.printing.managment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PagoResponse(
        Long id,
        BigDecimal monto,
        String metodo,
        LocalDateTime fecha,
        BigDecimal saldoPendiente
) {
}
