package com.printing.managment.dto;

import java.math.BigDecimal;

public record CotizacionRequest(
        Long idMaterial,
        Long idAcabado,
        BigDecimal ancho,
        BigDecimal alto,
        int cantidad
) {
}
