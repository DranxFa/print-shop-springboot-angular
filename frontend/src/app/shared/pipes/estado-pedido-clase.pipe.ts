import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoPedidoClase',
  standalone: true
})
export class EstadoPedidoClasePipe implements PipeTransform {
  transform(estado: string): string {
    const clases: Record<string, string> = {
      DISENO: 'bg-neutral-100 text-neutral-600 border border-neutral-300',
      IMPRESION: 'bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] border border-[var(--color-cyan)]/30',
      ACABADO: 'bg-[var(--color-amber)]/10 text-[var(--color-amber)] border border-[var(--color-amber)]/30',
      ENTREGADO: 'bg-green-50 text-green-700 border border-green-300'
    };
    return clases[estado] ?? 'bg-neutral-100 text-neutral-600 border border-neutral-300';
  }
}
