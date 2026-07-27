import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CotizacionResponse, ItemPedidoRequest } from '../../../../core/models/pedido.model';
import { MaterialService } from '../../../../core/services/material.service';
import { AcabadoService } from '../../../../core/services/acabado.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { CotizacionService } from '../../services/cotizacion.service';
import { PedidoService } from '../../../../core/services/pedido.service';
import { Router } from '@angular/router';
import { Acabado, Cliente, Material } from '../../../../core/models/catalogo.model';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

interface ItemAgregado {
  request: ItemPedidoRequest;
  nombreMaterial: string;
  nombreAcabado: string;
  total: number;
}

@Component({
  selector: 'app-cotizador',
  standalone: true,
  imports: [ReactiveFormsModule, HlmButton, HlmInput, HlmLabel],
  templateUrl: './cotizador.html',
  styleUrl: './cotizador.css',
})
export class Cotizador implements OnInit {
  private fb = inject(FormBuilder);
  private materialService = inject(MaterialService);
  private acabadoService = inject(AcabadoService);
  private clienteService = inject(ClienteService);
  private cotizacionService = inject(CotizacionService);
  private pedidoService = inject(PedidoService);
  private router = inject(Router);
 
  materiales = signal<Material[]>([]);
  acabados = signal<Acabado[]>([]);
  clientes = signal<Cliente[]>([]);
 
  calculando = signal(false);
  guardandoPedido = signal(false);
  clienteSeleccionado = signal<number | null>(null);
  itemsAgregados = signal<ItemAgregado[]>([]);
 
  form = this.fb.nonNullable.group({
    idMaterial: [null as number | null, Validators.required],
    idAcabado: [null as number | null],
    ancho: [100, [Validators.required, Validators.min(1)]],
    alto: [100, [Validators.required, Validators.min(1)]],
    cantidad: [1, [Validators.required, Validators.min(1)]]
  });

  readonly resultado = toSignal<CotizacionResponse | null>(
    this.form.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(valores => {
        const idMat = Number(valores.idMaterial);
        const idAcab = valores.idAcabado ? Number(valores.idAcabado) : null;
        if (!idMat || !valores.ancho || !valores.alto || !valores.cantidad) {
          this.calculando.set(false);
          return [null];
        }
        this.calculando.set(true);
        return this.cotizacionService.cotizar({
          idMaterial: idMat,
          idAcabado: idAcab,
          ancho: valores.ancho,
          alto: valores.alto,
          cantidad: valores.cantidad
        }).pipe(
          catchError(() => {
            this.calculando.set(false);
            return [null];
          }),
          tap(() => this.calculando.set(false))
        );
      })
    ),
    { initialValue: null }
  );
 
  totalPedido = computed(() =>
    this.itemsAgregados().reduce((suma, item) => suma + item.total, 0)
  );

  onClienteSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const val = target.value ? Number(target.value) : null;
    this.clienteSeleccionado.set(val);
  }

  formatCostoMat(m: Material): string {
    const raw = m.costoCm2 ?? (m as any).precioM2 ?? 0;
    return Number(raw).toFixed(4);
  }

  formatPrecioAcab(a: Acabado): string {
    const raw = a.precioBase ?? (a as any).costoFijo ?? 0;
    return Number(raw).toFixed(2);
  }

  getUnidadAcab(a: Acabado): string {
    return a.unidadMedida || (a as any).unidad || 'Unidad';
  }
 
  ngOnInit() {
    this.materialService.buscarTodos().subscribe(data => this.materiales.set(data));
    this.acabadoService.buscarTodos().subscribe(data => this.acabados.set(data));
    this.clienteService.buscarTodos().subscribe(data => this.clientes.set(data));
  }
 
  agregarItem() {
    const valores = this.form.getRawValue();
    const resultado = this.resultado();
    const idMat = Number(valores.idMaterial);
    const idAcab = valores.idAcabado ? Number(valores.idAcabado) : null;
    if (!idMat || !resultado) return;
 
    const material = this.materiales().find(m => m.id === idMat);
    const acabado = this.acabados().find(a => a.id === idAcab);
 
    this.itemsAgregados.update(items => [...items, {
      request: {
        idMaterial: idMat,
        idAcabado: idAcab,
        ancho: valores.ancho!,
        alto: valores.alto!,
        cantidad: valores.cantidad!
      },
      nombreMaterial: material?.nombre ?? '',
      nombreAcabado: acabado?.nombre ?? 'Sin acabado',
      total: resultado.total
    }]);
  }
 
  quitarItem(index: number) {
    this.itemsAgregados.update(items => items.filter((_, i) => i !== index));
  }
 
  confirmarPedido() {
    const idCliente = this.clienteSeleccionado();
    const items = this.itemsAgregados();
    if (!idCliente || items.length === 0) return;
 
    this.guardandoPedido.set(true);
    this.pedidoService.crear({
      idCliente,
      items: items.map(i => i.request)
    }).subscribe({
      next: () => {
        this.guardandoPedido.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => this.guardandoPedido.set(false)
    });
  }
}
