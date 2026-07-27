package com.printing.managment.service;

import com.printing.managment.dto.AcabadoRequest;
import com.printing.managment.dto.AcabadoResponse;

import java.util.List;

public interface AcabadoService {
    List<AcabadoResponse> obtenerTodos();
    AcabadoResponse obtenerPorId(Long id);
    AcabadoResponse crear(AcabadoRequest request);
    AcabadoResponse actualizar(Long id, AcabadoRequest request);
    void eliminar(Long id);
}
