package com.printing.managment.service.impl;

import com.printing.managment.dto.MaterialRequest;
import com.printing.managment.dto.MaterialResponse;
import com.printing.managment.exception.ResourceNotFoundException;
import com.printing.managment.model.Material;
import com.printing.managment.repository.MaterialRepository;
import com.printing.managment.service.MaterialService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;

    public MaterialServiceImpl(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaterialResponse> obtenerTodos() {
        return materialRepository.findAll().stream()
                .map(this::mapearADto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MaterialResponse obtenerPorId(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material no encontrado con ID: " + id));
        return mapearADto(material);
    }

    @Override
    @Transactional
    public MaterialResponse crear(MaterialRequest request) {
        Material material = new Material();
        material.setNombre(request.nombre());
        material.setPrecioM2(request.precioM2());
        material.setUnidad(request.unidad());
        Material guardado = materialRepository.save(material);
        return mapearADto(guardado);
    }

    @Override
    @Transactional
    public MaterialResponse actualizar(Long id, MaterialRequest request) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material no encontrado con ID: " + id));

        material.setNombre(request.nombre());
        material.setPrecioM2(request.precioM2());
        material.setUnidad(request.unidad());

        Material actualizado = materialRepository.save(material);
        return mapearADto(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!materialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Material no encontrado con ID: " + id);
        }
        materialRepository.deleteById(id);
    }

    private MaterialResponse mapearADto(Material material) {
        return new MaterialResponse(
                material.getId(),
                material.getNombre(),
                material.getPrecioM2(),
                material.getUnidad()
        );
    }
}
