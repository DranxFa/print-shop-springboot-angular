import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  authService = inject(AuthService);
  private router = inject(Router);

  cerrarSesion() {
    this.authService.logout();
  }

  irAlDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
