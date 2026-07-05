import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cliente } from '../models/catalogo.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/clientes`;

  private _clientes = signal<Cliente[]>([]);
  readonly clientes = this._clientes.asReadonly();

  buscarTodos() {
    return this.http.get<Cliente[]>(this.baseUrl).pipe(
      tap(data => this._clientes.set(data))
    );
  }

  crear(cliente: Partial<Cliente>) {
    return this.http.post<Cliente>(this.baseUrl, cliente).pipe(
      tap(newCli => {
        this._clientes.update(list => [...list, newCli]);
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
