package com.printing.managment.controller;

import com.printing.managment.model.Material;
import com.printing.managment.repository.MaterialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materiales")
public class MaterialController {

    private final MaterialRepository materialRepository;

    public MaterialController(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Material> buscar(@PathVariable Long id){
        return ResponseEntity.ok(materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material no encontrado")));
    }

    @GetMapping
    public ResponseEntity<List<Material>> buscarTodos(){
        return ResponseEntity.ok(materialRepository.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Material> crear(@RequestBody Material material){
        return ResponseEntity.ok(materialRepository.save(material));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        materialRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
