package com.printing.managment.dto;

import java.math.BigDecimal;

public record PagoRequest(
        BigDecimal monto,
        String metodo
) {
}
