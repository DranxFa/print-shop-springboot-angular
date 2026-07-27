package com.printing.managment.dto;

import java.math.BigDecimal;

public record AcabadoResponse(
        Long id,
        String nombre,
        BigDecimal costoFijo,
        BigDecimal costoM2
) {}
