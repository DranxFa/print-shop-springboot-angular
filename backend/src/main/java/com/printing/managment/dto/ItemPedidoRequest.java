package com.printing.managment.dto;

import java.math.BigDecimal;

public record ItemPedidoRequest(
        Long idMaterial,
        Long idAcabado,
        BigDecimal ancho,
        BigDecimal alto,
        int cantidad
) {
}
