import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoPedidoClase',
  standalone: true
})
export class EstadoPedidoClasePipe implements PipeTransform {
  transform(estado: string): string {
    const clases: Record<string, string> = {
      DISENO: 'bg-blue-900 text-white border border-blue-900',
      IMPRESION: 'bg-green-700 text-white border border-green-700',
      ACABADO: 'bg-orange-700 text-white border border-orange-700',
      ENTREGADO: 'bg-neutral-950 text-neutral-50 border border-black-950'
    };
    return clases[estado] ?? 'bg-neutral-100 text-neutral-600 border border-neutral-300';
  }
}
