package com.printing.managment.service;

import com.printing.managment.dto.*;
import com.printing.managment.model.*;
import com.printing.managment.repository.AcabadoRepository;
import com.printing.managment.repository.ClienteRepository;
import com.printing.managment.repository.MaterialRepository;
import com.printing.managment.repository.PedidoRepository;
import com.printing.managment.security.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {

    private final ClienteRepository clienteRepository;
    private final PedidoRepository pedidoRepository;
    private final MaterialRepository materialRepository;
    private final AcabadoRepository acabadoRepository;
    private final CotizacionService cotizacionService;

    public PedidoService(ClienteRepository clienteRepository, PedidoRepository pedidoRepository,
                         MaterialRepository materialRepository, AcabadoRepository acabadoRepository,
                         CotizacionService cotizacionService) {
        this.clienteRepository = clienteRepository;
        this.pedidoRepository = pedidoRepository;
        this.materialRepository = materialRepository;
        this.acabadoRepository = acabadoRepository;
        this.cotizacionService = cotizacionService;
    }

    public PedidoResponse crearPedido(PedidoRequest request){
        Cliente cliente = clienteRepository.findById(request.idCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));


        Pedido pedido = new Pedido();
        Usuario usuarioActual = obtenerUsuarioAutenticado();

        pedido.setCliente(cliente);

        List<ItemPedido> itemsPedido = request.items().stream().map( i -> crearItem(pedido,i)).toList();
        pedido.setItems(itemsPedido);
        pedido.setUsuario(usuarioActual);
        pedido.setTotal(itemsPedido.stream().map(ItemPedido::getPrecioCalculado)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        List<ItemPedidoResponse> itemsResponse =itemsPedido.stream().map(this::convertirAItemResponse).toList();

        return new PedidoResponse(pedidoGuardado.getId(),pedidoGuardado.getCliente().getId(),
                itemsResponse,pedidoGuardado.getEstadoActual(),pedidoGuardado.getTotal());
    }


    public PedidoResponse cambiarEstado(Long idPedido, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        Usuario usuarioActual = obtenerUsuarioAutenticado();

        pedido.setEstadoActual(nuevoEstado);

        HistorialEstado registro = new HistorialEstado();
        registro.setPedido(pedido);
        registro.setUsuario(usuarioActual);
        registro.setEstado(nuevoEstado);
        registro.setFecha(LocalDateTime.now());
        pedido.getHistorial().add(registro);

        Pedido pedidoActualizado = pedidoRepository.save(pedido);

        List<ItemPedidoResponse> itemsResponse = pedidoActualizado.getItems().stream()
                .map(this::convertirAItemResponse).toList();

        return new PedidoResponse(pedidoActualizado.getId(), pedidoActualizado.getCliente().getId(),
                itemsResponse, pedidoActualizado.getEstadoActual(), pedidoActualizado.getTotal());
    }

    private ItemPedido crearItem(Pedido pedido, ItemPedidoRequest itemRequest){

            Material material = materialRepository.findById(itemRequest.idMaterial())
                    .orElseThrow(() -> new RuntimeException("Material no encontrado"));

            Acabado acabado = itemRequest.idAcabado() != null?
                    acabadoRepository.findById(itemRequest.idAcabado()).orElse(null)
                    : null;

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setMaterial(material);
            item.setAcabado(acabado);
            item.setAltoCm(itemRequest.alto());
            item.setAnchoCm(itemRequest.ancho());
            item.setCantidad(itemRequest.cantidad());
            CotizacionResponse cotizacionResponse = cotizacionService.calcularPrecio
                    (material,acabado,item.getAltoCm(),item.getAnchoCm(),item.getCantidad());
            item.setPrecioCalculado(cotizacionResponse.total());

            return item;
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

    private Usuario obtenerUsuarioAutenticado() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return userDetails.getUsuario();
    }
}
