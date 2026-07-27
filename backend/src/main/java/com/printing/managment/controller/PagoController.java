package com.printing.managment.controller;

import com.printing.managment.dto.PagoRequest;
import com.printing.managment.dto.PagoResponse;
import com.printing.managment.service.PagoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos/{idPedido}/pagos")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping
    public ResponseEntity<PagoResponse> registrar(@PathVariable Long idPedido,
                                                  @Valid @RequestBody PagoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pagoService.registrarPago(idPedido, request));
    }

    @GetMapping
    public ResponseEntity<List<PagoResponse>> listar(@PathVariable Long idPedido) {
        return ResponseEntity.ok(pagoService.listarPagos(idPedido));
    }
}