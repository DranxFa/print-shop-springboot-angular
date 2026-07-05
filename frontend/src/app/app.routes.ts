import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
  },
  {
    path: '',
    loadComponent: () => import('./features/dashboard/components/layout/layout').then(m => m.DashboardLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'cotizador',
        loadComponent: () => import('./features/dashboard/components/cotizador/cotizador').then(m => m.Cotizador)
      },
      {
        path: 'pedidos/:id',
        loadComponent: () => import('./features/dashboard/components/pedido-detalle/pedido-detalle').then(m => m.PedidoDetalle)
      },
      {
        path: 'admin/catalogo',
        loadComponent: () => import('./features/dashboard/components/catalogo/catalogo').then(m => m.Catalogo),
        canActivate: [adminGuard]
      },
      {
        path: 'admin/usuarios',
        loadComponent: () => import('./features/dashboard/components/usuarios/usuarios').then(m => m.Usuarios),
        canActivate: [adminGuard]
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/dashboard/components/clientes/clientes').then(m => m.Clientes)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
