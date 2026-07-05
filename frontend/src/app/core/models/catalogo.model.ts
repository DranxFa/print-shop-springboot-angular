export interface Material {
  id: number;
  nombre: string;
  precioM2: number;
  unidad: string;
}
 
export interface Acabado {
  id: number;
  nombre: string;
  costoFijo: number;
  costoM2: number;
}
 
export interface Cliente {
  id: number;
  nombre: string;
  telefono?: string;
  rucDni?: string;
}