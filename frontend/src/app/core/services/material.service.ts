import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MaterialRequest, MaterialResponse } from '../models/catalogo.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/materiales`;

  private _materiales = signal<MaterialResponse[]>([]);
  readonly materiales = this._materiales.asReadonly();

  buscarTodos() {
    return this.http.get<MaterialResponse[]>(this.baseUrl).pipe(
      tap(data => {
        this._materiales.set(data)
      console.log(data)})
    );
  }

  buscarPorId(id: number) {
    return this.http.get<MaterialResponse>(`${this.baseUrl}/${id}`);
  }

  crear(material: MaterialRequest) {
    return this.http.post<MaterialResponse>(this.baseUrl, material).pipe(
      tap(newMat => {
        this._materiales.update(list => [...list, newMat]);
      })
    );
  }

  actualizar(id: number, material: MaterialRequest) {
    return this.http.put<MaterialResponse>(`${this.baseUrl}/${id}`, material).pipe(
      tap(updatedMat => {
        this._materiales.update(list => list.map(m => m.id === id ? updatedMat : m));
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
