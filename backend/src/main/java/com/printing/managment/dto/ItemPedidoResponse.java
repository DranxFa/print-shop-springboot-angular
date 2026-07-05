package com.printing.managment.dto;

import java.math.BigDecimal;

public record ItemPedidoResponse(
    String material,
    String acabado,
    BigDecimal ancho,
    BigDecimal alto,
    BigDecimal total
) {


}
