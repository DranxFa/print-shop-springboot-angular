package com.printing.managment.controller;

import com.printing.managment.dto.AcabadoRequest;
import com.printing.managment.dto.AcabadoResponse;
import com.printing.managment.service.AcabadoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/acabados")
public class AcabadoController {

    private final AcabadoService acabadoService;

    public AcabadoController(AcabadoService acabadoService) {
        this.acabadoService = acabadoService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcabadoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(acabadoService.obtenerPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<AcabadoResponse>> buscarTodos() {
        return ResponseEntity.ok(acabadoService.obtenerTodos());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<AcabadoResponse> crear(@Valid @RequestBody AcabadoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(acabadoService.crear(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<AcabadoResponse> actualizar(@PathVariable Long id, @Valid @RequestBody AcabadoRequest request) {
        return ResponseEntity.ok(acabadoService.actualizar(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        acabadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
