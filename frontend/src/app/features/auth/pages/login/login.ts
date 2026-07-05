import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HlmButton, HlmInput, HlmLabel],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
 
  readonly errorLogin = signal<string | null>(null);
  readonly cargando = signal(false);
 
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
 
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    this.errorLogin.set(null);
    this.cargando.set(true);
 
    const { email, password } = this.form.getRawValue();
 
    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.cargando.set(false);
        this.errorLogin.set('Email o contraseña incorrectos');
      }
    });
  }
}
