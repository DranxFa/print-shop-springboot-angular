import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
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
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmInput,
    HlmLabel,
    HlmSelectImports,
    HlmTableContainer,
    HlmTable,
    HlmTHead,
    HlmTBody,
    HlmTr,
    HlmTh,
    HlmTd
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  usuarios = this.usuarioService.usuarios;
  guardando = signal(false);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    rol: [null as unknown as 'ADMIN' | 'OPERARIO', Validators.required]
  });

  ngOnInit() {
    this.usuarioService.buscarTodos().subscribe();
  }

  onRolChange(rol: 'ADMIN' | 'OPERARIO') {
    this.form.patchValue({ rol });
  }

  crearUsuario() {
    if (this.form.invalid) return;
    this.guardando.set(true);

    const formValue = this.form.getRawValue();
    const request = {
      ...formValue,
      rol: formValue.rol as 'ADMIN' | 'OPERARIO'
    };

    this.usuarioService.crear(request).subscribe({
      next: () => {
        this.guardando.set(false);
        this.form.reset({ nombre: '', email: '', password: '', rol: null as unknown as 'ADMIN' | 'OPERARIO' });
      },
      error: () => this.guardando.set(false)
    });
  }

  eliminarUsuario(id: number) {
    this.usuarioService.eliminar(id).subscribe();
  }
}