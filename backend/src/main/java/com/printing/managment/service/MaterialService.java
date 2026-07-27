package com.printing.managment.service;

import com.printing.managment.dto.MaterialRequest;
import com.printing.managment.dto.MaterialResponse;

import java.util.List;

public interface MaterialService {
    List<MaterialResponse> obtenerTodos();
    MaterialResponse obtenerPorId(Long id);
    MaterialResponse crear(MaterialRequest request);
    MaterialResponse actualizar(Long id, MaterialRequest request);
    void eliminar(Long id);
}
