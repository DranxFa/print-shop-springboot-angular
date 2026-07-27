package com.printing.managment.service;

import com.printing.managment.dto.ClienteRequest;
import com.printing.managment.dto.ClienteResponse;

import java.util.List;

public interface ClienteService {
    List<ClienteResponse> obtenerTodos();
    ClienteResponse obtenerPorId(Long id);
    ClienteResponse crear(ClienteRequest request);
    ClienteResponse actualizar(Long id, ClienteRequest request);
    void eliminar(Long id);
}
