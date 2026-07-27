package com.printing.managment.service.impl;

import com.printing.managment.dto.AcabadoRequest;
import com.printing.managment.dto.AcabadoResponse;
import com.printing.managment.exception.ResourceNotFoundException;
import com.printing.managment.model.Acabado;
import com.printing.managment.repository.AcabadoRepository;
import com.printing.managment.service.AcabadoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AcabadoServiceImpl implements AcabadoService {

    private final AcabadoRepository acabadoRepository;

    public AcabadoServiceImpl(AcabadoRepository acabadoRepository) {
        this.acabadoRepository = acabadoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcabadoResponse> obtenerTodos() {
        return acabadoRepository.findAll().stream()
                .map(this::mapearADto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AcabadoResponse obtenerPorId(Long id) {
        Acabado acabado = acabadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Acabado no encontrado con ID: " + id));
        return mapearADto(acabado);
    }

    @Override
    @Transactional
    public AcabadoResponse crear(AcabadoRequest request) {
        Acabado acabado = new Acabado();
        acabado.setNombre(request.nombre());
        acabado.setCostoFijo(request.costoFijo());
        acabado.setCostoM2(request.costoM2());
        Acabado guardado = acabadoRepository.save(acabado);
        return mapearADto(guardado);
    }

    @Override
    @Transactional
    public AcabadoResponse actualizar(Long id, AcabadoRequest request) {
        Acabado acabado = acabadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Acabado no encontrado con ID: " + id));

        acabado.setNombre(request.nombre());
        acabado.setCostoFijo(request.costoFijo());
        acabado.setCostoM2(request.costoM2());

        Acabado actualizado = acabadoRepository.save(acabado);
        return mapearADto(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!acabadoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Acabado no encontrado con ID: " + id);
        }
        acabadoRepository.deleteById(id);
    }

    private AcabadoResponse mapearADto(Acabado acabado) {
        return new AcabadoResponse(
                acabado.getId(),
                acabado.getNombre(),
                acabado.getCostoFijo(),
                acabado.getCostoM2()
        );
    }
}
