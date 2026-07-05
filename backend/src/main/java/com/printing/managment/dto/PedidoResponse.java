package com.printing.managment.dto;

import com.printing.managment.model.EstadoPedido;

import java.math.BigDecimal;
import java.util.List;

public record PedidoResponse(
    Long idPedido,
    Long idCliente,
    List<ItemPedidoResponse> items,
    EstadoPedido estado,
    BigDecimal total
) {
}
