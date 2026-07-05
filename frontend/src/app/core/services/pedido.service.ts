import { inject, Injectable, computed } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EstadoPedido, PedidoRequest, PedidoResponse } from '../models/pedido.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/pedidos`;

  // rxResource gestiona automáticamente la carga, los estados y los errores
  private pedidosResource = rxResource<PedidoResponse[], void>({
    stream: () => this.http.get<PedidoResponse[]>(this.baseUrl)
  });

  // Mantenemos la API de señales pública para evitar romper componentes existentes
  pedidos = computed(() => this.pedidosResource.value() ?? []);
  cargando = this.pedidosResource.isLoading;

  cargarTodos() {
    this.pedidosResource.reload();
  }

  buscarPorEstado(estado: EstadoPedido) {
    return this.http.get<PedidoResponse[]>(`${this.baseUrl}/estado`, {
      params: { filtro: estado }
    });
  }

  buscarUno(id: number) {
    return this.http.get<PedidoResponse>(`${this.baseUrl}/${id}`);
  }

  crear(request: PedidoRequest) {
    return this.http.post<PedidoResponse>(this.baseUrl, request).pipe(
      tap(() => this.pedidosResource.reload())
    );
  }

  cambiarEstado(id: number, nuevoEstado: EstadoPedido) {
    return this.http.patch<PedidoResponse>(`${this.baseUrl}/${id}/estado`, null, {
      params: { nuevoEstado }
    }).pipe(
      tap(() => this.pedidosResource.reload())
    );
  }
}
