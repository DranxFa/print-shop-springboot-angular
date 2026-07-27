package com.printing.managment.service;

import com.printing.managment.dto.UsuarioRequest;
import com.printing.managment.dto.UsuarioResponse;

import java.util.List;

public interface UsuarioService {
    List<UsuarioResponse> obtenerTodos();
    UsuarioResponse obtenerPorId(Long id);
    UsuarioResponse crear(UsuarioRequest request);
    UsuarioResponse actualizar(Long id, UsuarioRequest request);
    void eliminar(Long id);
}
