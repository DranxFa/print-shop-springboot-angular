package com.printing.managment.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedido")
@Getter
@Setter
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_actual", nullable = false, length = 20)
    private EstadoPedido estadoActual = EstadoPedido.DISENO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL,  orphanRemoval = true)
    private List<ItemPedido> items = new ArrayList<>();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL,  orphanRemoval = true)
    private List<HistorialEstado> historial = new ArrayList<>();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL,  orphanRemoval = true)
    private List<Pago> pagos = new ArrayList<>();

}
