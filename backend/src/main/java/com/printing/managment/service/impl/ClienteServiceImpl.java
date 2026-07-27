package com.printing.managment.service.impl;

import com.printing.managment.dto.ClienteRequest;
import com.printing.managment.dto.ClienteResponse;
import com.printing.managment.exception.DuplicateResourceException;
import com.printing.managment.exception.ResourceNotFoundException;
import com.printing.managment.model.Cliente;
import com.printing.managment.repository.ClienteRepository;
import com.printing.managment.service.ClienteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> obtenerTodos() {
        return clienteRepository.findAll().stream()
                .map(this::mapearADto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponse obtenerPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        return mapearADto(cliente);
    }

    @Override
    @Transactional
    public ClienteResponse crear(ClienteRequest request) {
        if (request.rucDni() != null && !request.rucDni().isBlank()) {
            if (clienteRepository.existsByRucDni(request.rucDni())) {
                throw new DuplicateResourceException("Ya existe un cliente registrado con el RUC/DNI: " + request.rucDni());
            }
        }

        Cliente cliente = new Cliente();
        cliente.setNombre(request.nombre());
        cliente.setTelefono(request.telefono());
        cliente.setRucDni(request.rucDni());

        Cliente guardado = clienteRepository.save(cliente);
        return mapearADto(guardado);
    }

    @Override
    @Transactional
    public ClienteResponse actualizar(Long id, ClienteRequest request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));

        if (request.rucDni() != null && !request.rucDni().isBlank()) {
            if (clienteRepository.existsByRucDniAndIdNot(request.rucDni(), id)) {
                throw new DuplicateResourceException("Ya existe otro cliente registrado con el RUC/DNI: " + request.rucDni());
            }
        }

        cliente.setNombre(request.nombre());
        cliente.setTelefono(request.telefono());
        cliente.setRucDni(request.rucDni());

        Cliente actualizado = clienteRepository.save(cliente);
        return mapearADto(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente no encontrado con ID: " + id);
        }
        clienteRepository.deleteById(id);
    }

    private ClienteResponse mapearADto(Cliente cliente) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getTelefono(),
                cliente.getRucDni()
        );
    }
}
