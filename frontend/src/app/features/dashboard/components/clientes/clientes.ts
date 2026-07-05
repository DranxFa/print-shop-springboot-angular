import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../../core/services/cliente.service';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { 
  HlmTableContainer, 
  HlmTable, 
  HlmTHead, 
  HlmTBody, 
  HlmTr, 
  HlmTh, 
  HlmTd 
} from '@spartan-ng/helm/table';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmInput,
    HlmLabel,
    HlmTableContainer,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  clientes = this.clienteService.clientes;
  guardando = signal(false);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    rucDni: ['', Validators.required]
  });

  ngOnInit() {
    this.clienteService.buscarTodos().subscribe();
  }

  crearCliente() {
    if (this.form.invalid) return;
    this.guardando.set(true);
    this.clienteService.crear(this.form.getRawValue()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.form.reset({ nombre: '', telefono: '', rucDni: '' });
      },
      error: () => this.guardando.set(false)
    });
  }

  eliminarCliente(id: number) {
    this.clienteService.eliminar(id).subscribe();
  }
}
