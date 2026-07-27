package com.printing.managment.dto;

import java.math.BigDecimal;

public record MaterialResponse(
        Long id,
        String nombre,
        BigDecimal precioM2,
        String unidad
) {}
