import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard, lucideCalculator, lucideBookOpen, lucideLogOut, lucideUser, lucidePrinter, lucideUsers, lucideUserCheck } from '@ng-icons/lucide';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIcon],
  providers: [provideIcons({ lucideLayoutDashboard, lucideCalculator, lucideBookOpen, lucideLogOut, lucideUser, lucidePrinter, lucideUsers, lucideUserCheck })],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class DashboardLayout {
  authService = inject(AuthService);
  router = inject(Router);

  cerrarSesion() {
    this.authService.logout();
  }
}
