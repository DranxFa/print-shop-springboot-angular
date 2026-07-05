import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EstadoPedido, PagoResponse, PedidoResponse } from '../../../../core/models/pedido.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PedidoService } from '../../../../core/services/pedido.service';
import { PagoService } from '../../services/pago.service';
import { DatePipe } from '@angular/common';
import { EstadoPedidoClasePipe } from '../../../../shared/pipes/estado-pedido-clase.pipe';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';

const ORDEN_ESTADOS: EstadoPedido[] = ['DISENO', 'IMPRESION', 'ACABADO', 'ENTREGADO'];

@Component({
  selector: 'app-pedido-detalle',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    EstadoPedidoClasePipe,
    HlmButton,
    HlmInput,
    HlmSelectImports
  ],
  templateUrl: './pedido-detalle.html',
  styleUrl: './pedido-detalle.css',
})
export class PedidoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private pedidoService = inject(PedidoService);
  private pagoService = inject(PagoService);

  pedido = signal<PedidoResponse | null>(null);
  cargando = signal(true);
  cambiandoEstado = signal(false);
  registrandoPago = signal(false);
  errorPago = signal<string | null>(null);

  pagos = signal<PagoResponse[]>([]);

  saldoPendiente = computed(() => {
    const pagos = this.pagos();
    if (pagos.length > 0) {
      return pagos[pagos.length - 1].saldoPendiente;
    }
    return this.pedido()?.total ?? 0;
  });

  siguienteEstado = computed<EstadoPedido | null>(() => {
    const actual = this.pedido()?.estado;
    if (!actual) return null;
    const index = ORDEN_ESTADOS.indexOf(actual);
    if (index === -1 || index === ORDEN_ESTADOS.length - 1) return null;
    return ORDEN_ESTADOS[index + 1];
  });

  formPago = this.fb.nonNullable.group({
    monto: [0, [Validators.required, Validators.min(0.01)]],
    metodo: [null as unknown as string, Validators.required]
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPedido(id);
    this.cargarPagos(id);
  }

  cargarPedido(id: number) {
    this.cargando.set(true);
    this.pedidoService.buscarUno(id).subscribe({
      next: (data) => {
        this.pedido.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  cargarPagos(id: number) {
    this.pagoService.listar(id).subscribe({
      next: (data) => this.pagos.set(data)
    });
  }

  avanzarEstado() {
    const pedido = this.pedido();
    const nuevoEstado = this.siguienteEstado();
    if (!pedido || !nuevoEstado) return;

    this.cambiandoEstado.set(true);
    this.pedidoService.cambiarEstado(pedido.idPedido, nuevoEstado).subscribe({
      next: (actualizado) => {
        this.pedido.set(actualizado);
        this.cambiandoEstado.set(false);
      },
      error: () => this.cambiandoEstado.set(false)
    });
  }

  registrarPago() {
    const pedido = this.pedido();
    if (!pedido || this.formPago.invalid) return;

    this.errorPago.set(null);
    this.registrandoPago.set(true);

    const { monto, metodo } = this.formPago.getRawValue();

    this.pagoService.registrar(pedido.idPedido, { monto, metodo }).subscribe({
      next: () => {
        this.registrandoPago.set(false);
        this.formPago.reset({ monto: 0, metodo: 'efectivo' });
        this.cargarPagos(pedido.idPedido);
      },
      error: (err) => {
        this.registrandoPago.set(false);
        this.errorPago.set(err.error?.mensaje ?? 'No se pudo registrar el pago');
      }
    });
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}
