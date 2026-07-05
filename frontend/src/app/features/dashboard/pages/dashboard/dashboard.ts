import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { PedidoService } from '../../../../core/services/pedido.service';
import { Router } from '@angular/router';
import { EstadoPedidoClasePipe } from '../../../../shared/pipes/estado-pedido-clase.pipe';
import { 
  HlmTableContainer, 
  HlmTable, 
  HlmTHead, 
  HlmTBody, 
  HlmTr, 
  HlmTh, 
  HlmTd 
} from '@spartan-ng/helm/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    EstadoPedidoClasePipe, 
    HlmTableContainer, 
    HlmTable, 
    HlmTHead, 
    HlmTBody, 
    HlmTr, 
    HlmTh, 
    HlmTd
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private pedidoService = inject(PedidoService);
  authService = inject(AuthService);
  router = inject(Router);
 
  // Lee directamente del servicio reactivo con rxResource
  pedidos = this.pedidoService.pedidos;
  cargando = this.pedidoService.cargando;
 
  totalPedidos = computed(() => this.pedidos().length);
 
  enProduccion = computed(() =>
    this.pedidos().filter((p: any) => p.estado !== 'ENTREGADO').length
  );
 
  ingresosTotal = computed(() =>
    this.pedidos().reduce((suma: number, p: any) => suma + p.total, 0)
  );
 
  ngOnInit() {
    this.pedidoService.cargarTodos();
  }
 
  irACotizador() {
    this.router.navigate(['/cotizador']);
  }
}
