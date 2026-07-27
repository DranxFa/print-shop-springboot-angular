import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioResponse } from '../../../../core/models/auth.model';
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
  private authService = inject(AuthService);

  usuarios = this.usuarioService.usuarios;
  guardando = signal(false);
  usuarioEditando = signal<UsuarioResponse | null>(null);
  usuarioActual = this.authService.usuario;

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    rol: [null as unknown as 'ADMIN' | 'OPERARIO', Validators.required]
  });

  formEdit = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    rol: ['OPERARIO' as 'ADMIN' | 'OPERARIO', Validators.required]
  });

  ngOnInit() {
    this.usuarioService.buscarTodos().subscribe();
  }

  onRolChange(rol: 'ADMIN' | 'OPERARIO') {
    this.form.patchValue({ rol });
  }

  onEditRolChange(rol: 'ADMIN' | 'OPERARIO') {
    this.formEdit.patchValue({ rol });
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

  abrirEditarUsuario(usuario: UsuarioResponse) {
    this.usuarioEditando.set(usuario);
    this.formEdit.setValue({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol
    });
  }

  guardarEditUsuario() {
    const target = this.usuarioEditando();
    if (!target || this.formEdit.invalid) return;
    this.guardando.set(true);

    const raw = this.formEdit.getRawValue();
    const payload = {
      nombre: raw.nombre,
      email: raw.email,
      password: raw.password ? raw.password : undefined,
      rol: raw.rol
    };

    this.usuarioService.actualizar(target.id, payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.usuarioEditando.set(null);
      },
      error: () => this.guardando.set(false)
    });
  }

  eliminarUsuario(id: number) {
    this.usuarioService.eliminar(id).subscribe();
  }
}