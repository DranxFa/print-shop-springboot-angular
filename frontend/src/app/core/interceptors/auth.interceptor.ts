import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
 
  // La ruta de login no necesita token (obviamente, todavía no existe)
  if (!token || req.url.includes('/auth/login')) {
    return next(req);
  }
 
  const requestConToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
 
  return next(requestConToken);
};
