import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginRequest, LoginResponse, Rol } from '../models/auth.model';
import { environment } from '../../../environments/environment';

interface UsuarioActual {
  nombre: string;
  rol: Rol;
}

const TOKEN_KEY = 'imprenta_token';
const USUARIO_KEY = 'imprenta_usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signal privado con el estado real; se expone solo lectura afuera
  private usuarioActual = signal<UsuarioActual | null>(this.recuperarUsuarioGuardado());
 
  // Cualquier componente puede leer esto de forma reactiva:
  // authService.estaAutenticado() en una plantilla, por ejemplo
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);
  readonly usuario = this.usuarioActual.asReadonly();
  readonly esAdmin = computed(() => this.usuarioActual()?.rol === 'ADMIN');
 
  constructor(private http: HttpClient, private router: Router) {}
 
  login(credenciales: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credenciales).pipe(
      tap(response => {
        localStorage.setItem(TOKEN_KEY, response.token);
        const usuario: UsuarioActual = { nombre: response.nombre, rol: response.rol };
        localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
        this.usuarioActual.set(usuario);
      })
    );
  }
 
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }
 
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
 
  // Al recargar la página, Angular pierde el estado en memoria —
  // esto reconstruye el Signal a partir de lo guardado en localStorage,
  // para que el usuario siga "logueado" tras un refresh.
  private recuperarUsuarioGuardado(): UsuarioActual | null {
    const guardado = localStorage.getItem(USUARIO_KEY);
    return guardado ? JSON.parse(guardado) : null;
  }
}
