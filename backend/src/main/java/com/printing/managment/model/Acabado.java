package com.printing.managment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "acabado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Acabado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "costo_fijo", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoFijo = BigDecimal.ZERO;

    @Column(name = "costo_m2", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoM2 = BigDecimal.ZERO;
}
