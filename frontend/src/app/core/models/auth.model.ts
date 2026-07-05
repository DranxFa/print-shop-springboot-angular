export type Rol = 'ADMIN' | 'OPERARIO';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  nombre: string;
  rol: Rol;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface UsuarioRequest {
  nombre: string;
  email: string;
  password?: string;
  rol: Rol;
}