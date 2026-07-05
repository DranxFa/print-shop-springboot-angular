import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsuarioRequest, UsuarioResponse } from '../models/auth.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/usuarios`;

  private _usuarios = signal<UsuarioResponse[]>([]);
  readonly usuarios = this._usuarios.asReadonly();

  buscarTodos() {
    return this.http.get<UsuarioResponse[]>(this.baseUrl).pipe(
      tap(data => this._usuarios.set(data))
    );
  }

  crear(usuario: UsuarioRequest) {
    return this.http.post<UsuarioResponse>(this.baseUrl, usuario).pipe(
      tap(newUsr => {
        this._usuarios.update(list => [...list, newUsr]);
      })
    );
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._usuarios.update(list => list.filter(u => u.id !== id));
      })
    );
  }
}
