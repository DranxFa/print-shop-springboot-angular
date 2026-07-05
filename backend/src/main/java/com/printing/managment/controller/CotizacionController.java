package com.printing.managment.controller;

import com.printing.managment.dto.CotizacionRequest;
import com.printing.managment.dto.CotizacionResponse;
import com.printing.managment.service.CotizacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cotizaciones")
public class CotizacionController {

    private final CotizacionService cotizacionService;

    public CotizacionController(CotizacionService cotizacionService) {
        this.cotizacionService = cotizacionService;
    }

    @PostMapping
    public ResponseEntity<CotizacionResponse> cotizar(@RequestBody CotizacionRequest request){
        CotizacionResponse response = cotizacionService.cotizar(request);
        return ResponseEntity.ok(response);
    }
}
