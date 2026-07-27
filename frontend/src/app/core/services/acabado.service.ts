import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AcabadoRequest, AcabadoResponse } from '../models/catalogo.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AcabadoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/acabados`;

  private _acabados = signal<AcabadoResponse[]>([]);
  readonly acabados = this._acabados.asReadonly();

  buscarTodos() {
    return this.http.get<AcabadoResponse[]>(this.baseUrl).pipe(
      tap(data => this._acabados.set(data))
    );
  }

  buscarPorId(id: number) {
    return this.http.get<AcabadoResponse>(`${this.baseUrl}/${id}`);
  }

  crear(acabado: AcabadoRequest) {
    return this.http.post<AcabadoResponse>(this.baseUrl, acabado).pipe(
      tap(newAcabado => {
        this._acabados.update(list => [...list, newAcabado]);
      })
    );
  }

  actualizar(id: number, acabado: AcabadoRequest) {
    return this.http.put<AcabadoResponse>(`${this.baseUrl}/${id}`, acabado).pipe(
      tap(updatedAcabado => {
        this._acabados.update(list => list.map(a => a.id === id ? updatedAcabado : a));
      })
    );
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._acabados.update(list => list.filter(a => a.id !== id));
      })
    );
  }
}
