package com.printing.managment.dto;

import java.util.List;

public record PedidoRequest (
    Long idCliente,
    List<ItemPedidoRequest> items
){}
