import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ClienteResponse } from '../../../../core/models/catalogo.model';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
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
    HlmDialogImports,
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
  clienteEditando = signal<ClienteResponse | null>(null);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    documento: ['', Validators.required],
    telefono: [''],
    direccion: ['']
  });

  formEdit = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    documento: ['', Validators.required],
    telefono: [''],
    direccion: ['']
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
        this.form.reset({ nombre: '', email: '', documento: '', telefono: '', direccion: '' });
      },
      error: () => this.guardando.set(false)
    });
  }

  abrirEditarCliente(cliente: ClienteResponse) {
    this.clienteEditando.set(cliente);
    this.formEdit.setValue({
      nombre: cliente.nombre,
      email: cliente.email || '',
      documento: cliente.documento || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || ''
    });
  }

  guardarEditCliente() {
    const target = this.clienteEditando();
    if (!target || this.formEdit.invalid) return;
    this.guardando.set(true);
    this.clienteService.actualizar(target.id, this.formEdit.getRawValue()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.clienteEditando.set(null);
      },
      error: () => this.guardando.set(false)
    });
  }

  eliminarCliente(id: number) {
    this.clienteService.eliminar(id).subscribe();
  }
}
