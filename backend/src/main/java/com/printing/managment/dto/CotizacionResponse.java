package com.printing.managment.dto;

import java.math.BigDecimal;

public record CotizacionResponse(
        BigDecimal area,
        BigDecimal costoMaterial,
        BigDecimal costoAcabado,
        BigDecimal margen,
        BigDecimal total
) {

}
