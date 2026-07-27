package com.printing.managment.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PedidoRequest(
        @NotNull(message = "El ID del cliente es obligatorio")
        Long idCliente,

        @NotEmpty(message = "El pedido debe contener al menos un ítem")
        List<@Valid ItemPedidoRequest> items
) {}
