import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PagoRequest, PagoResponse } from '../../../core/models/pedido.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private http = inject(HttpClient);
 
  registrar(idPedido: number, request: PagoRequest) {
    return this.http.post<PagoResponse>(
      `${environment.apiUrl}/pedidos/${idPedido}/pagos`,
      request
    );
  }
 
  listar(idPedido: number) {
    return this.http.get<PagoResponse[]>(
      `${environment.apiUrl}/pedidos/${idPedido}/pagos`
    );
  }
}
