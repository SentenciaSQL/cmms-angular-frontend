import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard - Verificando autenticación para:', state.url);
  console.log('AuthGuard - Token:', authService.getToken());
  console.log('AuthGuard - isAuthenticated:', authService.isAuthenticated());

  if (authService.isAuthenticated()) {
    // Verificar roles si están especificados
    const requiredRoles = route.data['roles'] as string[];

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some(role => authService.hasRole(role));

      if (!hasRole) {
        console.log('AuthGuard - Usuario no tiene los roles requeridos');
        router.navigate(['/unauthorized']);
        return false;
      }
    }

    console.log('AuthGuard - Acceso permitido');
    return true;
  }

  // No autenticado, redirigir al login
  console.log('AuthGuard - No autenticado, redirigiendo a login');
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
