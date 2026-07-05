package com.printing.managment.controller;

import com.printing.managment.model.Acabado;
import com.printing.managment.repository.AcabadoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/acabados")
public class AcabadoController {

    private final AcabadoRepository acabadoRepository;

    public AcabadoController(AcabadoRepository acabadoRepository) {
        this.acabadoRepository = acabadoRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Acabado> buscar(@PathVariable Long id){
        return ResponseEntity.ok(acabadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Acabado no encontrado")));
    }

    @GetMapping
    public ResponseEntity<List<Acabado>> buscarTodos(){
        return ResponseEntity.ok(acabadoRepository.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Acabado> crear(@RequestBody Acabado acabado){
        return ResponseEntity.ok(acabadoRepository.save(acabado));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        acabadoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
