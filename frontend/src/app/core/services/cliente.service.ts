import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ClienteRequest, ClienteResponse } from '../models/catalogo.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/clientes`;

  private _clientes = signal<ClienteResponse[]>([]);
  readonly clientes = this._clientes.asReadonly();

  buscarTodos() {
    return this.http.get<ClienteResponse[]>(this.baseUrl).pipe(
      tap(data => this._clientes.set(data))
    );
  }

  buscarPorId(id: number) {
    return this.http.get<ClienteResponse>(`${this.baseUrl}/${id}`);
  }

  crear(cliente: ClienteRequest) {
    return this.http.post<ClienteResponse>(this.baseUrl, cliente).pipe(
      tap(newCli => {
        this._clientes.update(list => [...list, newCli]);
      })
    );
  }

  actualizar(id: number, cliente: ClienteRequest) {
    return this.http.put<ClienteResponse>(`${this.baseUrl}/${id}`, cliente).pipe(
      tap(updatedCli => {
        this._clientes.update(list => list.map(c => c.id === id ? updatedCli : c));
      })
    );
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._clientes.update(list => list.filter(c => c.id !== id));
      })
    );
  }
}
