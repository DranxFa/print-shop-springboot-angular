import { inject, Injectable } from '@angular/core';
import { CotizacionRequest, CotizacionResponse } from '../../../core/models/pedido.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  private http = inject(HttpClient);
 
  cotizar(request: CotizacionRequest) {
    return this.http.post<CotizacionResponse>(`${environment.apiUrl}/cotizaciones`, request);
  }
}
