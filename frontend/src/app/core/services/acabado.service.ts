import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Acabado } from '../models/catalogo.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AcabadoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/acabados`;

  private _acabados = signal<Acabado[]>([]);
  readonly acabados = this._acabados.asReadonly();

  buscarTodos() {
    return this.http.get<Acabado[]>(this.baseUrl).pipe(
      tap(data => this._acabados.set(data))
    );
  }

  crear(acabado: Partial<Acabado>) {
    return this.http.post<Acabado>(this.baseUrl, acabado).pipe(
      tap(newAcabado => {
        this._acabados.update(list => [...list, newAcabado]);
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
