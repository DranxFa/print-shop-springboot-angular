// Materiales
export interface MaterialRequest {
  nombre: string;
  descripcion?: string;
  costoCm2: number;
  stockMinimo: number;
}

export interface MaterialResponse {
  id: number;
  nombre: string;
  descripcion?: string;
  costoCm2: number;
  stockMinimo: number;
}

export type Material = MaterialResponse;
 
// Acabados
export interface AcabadoRequest {
  nombre: string;
  descripcion?: string;
  precioBase: number;
  unidadMedida: string;
}

export interface AcabadoResponse {
  id: number;
  nombre: string;
  descripcion?: string;
  precioBase: number;
  unidadMedida: string;
}

export type Acabado = AcabadoResponse;
 
// Clientes
export interface ClienteRequest {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  documento: string;
}

export interface ClienteResponse {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  documento: string;
}

export type Cliente = ClienteResponse;