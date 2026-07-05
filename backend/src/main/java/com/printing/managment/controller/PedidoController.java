package com.printing.managment.controller;

import com.printing.managment.dto.ItemPedidoResponse;
import com.printing.managment.dto.PedidoRequest;
import com.printing.managment.dto.PedidoResponse;
import com.printing.managment.model.EstadoPedido;
import com.printing.managment.model.ItemPedido;
import com.printing.managment.model.Pedido;
import com.printing.managment.repository.PedidoRepository;
import com.printing.managment.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;
    private final PedidoRepository pedidoRepository;

    public PedidoController(PedidoService pedidoService, PedidoRepository pedidoRepository) {
        this.pedidoService = pedidoService;
        this.pedidoRepository = pedidoRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscar(@PathVariable Long id){

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Pedido no encontrado"));

        return ResponseEntity.ok(convertirAPedidoResponse(pedido));
    }

    @GetMapping("/estado")
    public ResponseEntity<List<PedidoResponse>> buscarPorEstado(@RequestParam EstadoPedido estado){

        List<Pedido> pedidosPorEstado = pedidoRepository.findByEstadoActual(estado);

        return ResponseEntity.ok(pedidosPorEstado.stream().map(this::convertirAPedidoResponse).toList());
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> buscarTodos(){
        return ResponseEntity.ok(pedidoRepository.findAll().stream().map(this::convertirAPedidoResponse).toList());
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<PedidoResponse> cambiarEstado(@PathVariable Long id,
                                                        @RequestParam EstadoPedido nuevoEstado){
        return ResponseEntity.ok(pedidoService.cambiarEstado(id, nuevoEstado));
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> crear(@RequestBody PedidoRequest request){
        return ResponseEntity.ok(pedidoService.crearPedido(request));
    }

    private PedidoResponse convertirAPedidoResponse(Pedido pedido){
        return new PedidoResponse(
                pedido.getId(),pedido.getCliente().getId(),
                pedido.getItems().stream().map(this::convertirAItemResponse).toList(),
                pedido.getEstadoActual(),pedido.getTotal());
    }

    private ItemPedidoResponse convertirAItemResponse(ItemPedido itemPedido){
        return new ItemPedidoResponse(
                itemPedido.getMaterial().getNombre(),
                itemPedido.getAcabado() !=  null? itemPedido.getAcabado().getNombre(): "Sin acabado",
                itemPedido.getAnchoCm(),
                itemPedido.getAltoCm(),
                itemPedido.getPrecioCalculado()
        );
    }
}
