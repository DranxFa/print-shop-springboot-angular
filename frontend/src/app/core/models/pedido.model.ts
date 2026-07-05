export type EstadoPedido = 'DISENO' | 'IMPRESION' | 'ACABADO' | 'ENTREGADO';

export interface CotizacionRequest {
  idMaterial: number;
  idAcabado: number | null;
  ancho: number;
  alto: number;
  cantidad: number;
}

export interface CotizacionResponse {
  area: number;
  costoMaterial: number;
  costoAcabado: number;
  margen: number;
  total: number;
}

export interface ItemPedidoRequest {
  idMaterial: number;
  idAcabado: number | null;
  ancho: number;
  alto: number;
  cantidad: number;
}

export interface ItemPedidoResponse {
  material: string;
  acabado: string;
  ancho: number;
  alto: number;
  total: number;
}

export interface PedidoRequest {
  idCliente: number;
  items: ItemPedidoRequest[];
}

export interface PedidoResponse {
  idPedido: number;
  idCliente: number;
  items: ItemPedidoResponse[];
  estado: EstadoPedido;
  total: number;
}

export interface PagoRequest {
  monto: number;
  metodo: string;
}

export interface PagoResponse {
  id: number;
  monto: number;
  metodo: string;
  fecha: string;
  saldoPendiente: number;
}