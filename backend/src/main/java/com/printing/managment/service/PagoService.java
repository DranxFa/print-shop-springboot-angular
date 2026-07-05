package com.printing.managment.service;

import com.printing.managment.dto.PagoRequest;
import com.printing.managment.dto.PagoResponse;
import com.printing.managment.model.Pago;
import com.printing.managment.model.Pedido;
import com.printing.managment.repository.PagoRepository;
import com.printing.managment.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;

    public PagoService(PagoRepository pagoRepository, PedidoRepository pedidoRepository) {
        this.pagoRepository = pagoRepository;
        this.pedidoRepository = pedidoRepository;
    }

    public PagoResponse registrarPago(Long idPedido, PagoRequest request) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        BigDecimal totalPagado = calcularTotalPagado(pedido);
        BigDecimal saldoPendiente = pedido.getTotal().subtract(totalPagado);

        if (request.monto().compareTo(saldoPendiente) > 0) {
            throw new IllegalArgumentException(
                    "El monto excede el saldo pendiente (S/ " + saldoPendiente + ")");
        }

        Pago pago = new Pago();
        pago.setPedido(pedido);
        pago.setMonto(request.monto());
        pago.setMetodo(request.metodo());

        Pago pagoGuardado = pagoRepository.save(pago);

        BigDecimal nuevoSaldo = saldoPendiente.subtract(request.monto());

        return new PagoResponse(pagoGuardado.getId(), pagoGuardado.getMonto(),
                pagoGuardado.getMetodo(), pagoGuardado.getFecha(), nuevoSaldo);
    }

    public List<PagoResponse> listarPagos(Long idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        List<Pago> pagosOrdenados = pedido.getPagos().stream()
                .sorted(Comparator.comparing(Pago::getFecha))
                .toList();

        List<PagoResponse> resultado = new ArrayList<>();
        BigDecimal totalPagado = BigDecimal.ZERO;

        for (Pago pago : pagosOrdenados) {
            totalPagado = totalPagado.add(pago.getMonto());
            BigDecimal saldoEnEseMomento = pedido.getTotal().subtract(totalPagado);
            resultado.add(new PagoResponse(pago.getId(), pago.getMonto(),
                    pago.getMetodo(), pago.getFecha(), saldoEnEseMomento));
        }

        return resultado;
    }

    private BigDecimal calcularTotalPagado(Pedido pedido) {
        return pedido.getPagos().stream()
                .map(Pago::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
