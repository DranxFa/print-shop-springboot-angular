package com.printing.managment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "item_pedido")
@Getter
@Setter
@NoArgsConstructor
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acabado_id")
    private Acabado acabado;

    @Column(name = "ancho_cm", nullable = false, precision = 6, scale = 2)
    private BigDecimal anchoCm;

    @Column(name = "alto_cm", nullable = false, precision = 6, scale = 2)
    private BigDecimal altoCm;

    @Column(nullable = false)
    private int cantidad;

    @Column(name = "precio_calculado", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioCalculado;


}
