import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Material } from '../models/catalogo.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/materiales`;

  private _materiales = signal<Material[]>([]);
  readonly materiales = this._materiales.asReadonly();

  buscarTodos() {
    return this.http.get<Material[]>(this.baseUrl).pipe(
      tap(data => this._materiales.set(data))
    );
  }

  crear(material: Partial<Material>) {
    return this.http.post<Material>(this.baseUrl, material).pipe(
      tap(newMat => {
        this._materiales.update(list => [...list, newMat]);
      })
    );
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._materiales.update(list => list.filter(m => m.id !== id));
      })
    );
  }
}
