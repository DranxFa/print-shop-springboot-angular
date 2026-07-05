package com.printing.managment.service;

import com.printing.managment.dto.CotizacionRequest;
import com.printing.managment.dto.CotizacionResponse;
import com.printing.managment.model.Acabado;
import com.printing.managment.model.Material;
import com.printing.managment.repository.AcabadoRepository;
import com.printing.managment.repository.MaterialRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CotizacionService {

    private static final BigDecimal MARGEN_ESTANDAR = new BigDecimal("0.35");
    private final MaterialRepository materialRepository;
    private final AcabadoRepository acabadoRepository;

    public CotizacionService(MaterialRepository materialRepository, AcabadoRepository acabadoRepository) {
        this.materialRepository = materialRepository;
        this.acabadoRepository = acabadoRepository;
    }

    public CotizacionResponse cotizar(CotizacionRequest request){
        Material material = materialRepository.findById(request.idMaterial())
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));

        Acabado acabado = request.idAcabado() != null?
                acabadoRepository.findById(request.idAcabado()).orElse(null)
                : null;

        return calcularPrecio(material, acabado, request.alto(), request.ancho(), request.cantidad());

    }

    public CotizacionResponse calcularPrecio(Material material, Acabado acabado, BigDecimal altoCm,
                                     BigDecimal anchoCm, int cantidad){

        BigDecimal area = altoCm.multiply(anchoCm).divide(new BigDecimal("10000"), 4, RoundingMode.HALF_UP);

        BigDecimal materialCalculado = area.multiply(material.getPrecioM2());
        BigDecimal acabadoCalculado = acabado != null ? acabado.getCostoFijo().add(area.multiply(acabado.getCostoM2())) : BigDecimal.ZERO;

        BigDecimal subTotal = materialCalculado.add(acabadoCalculado).multiply(BigDecimal.valueOf(cantidad));
        BigDecimal precioMargen = subTotal.multiply(MARGEN_ESTANDAR);
        BigDecimal precioFinal = subTotal.add(precioMargen);

        return new CotizacionResponse(
                area,
                materialCalculado.setScale(2, RoundingMode.HALF_UP),
                acabadoCalculado.setScale(2, RoundingMode.HALF_UP),
                precioMargen.setScale(2, RoundingMode.HALF_UP),
                precioFinal.setScale(2, RoundingMode.HALF_UP)
        );
    }
}
