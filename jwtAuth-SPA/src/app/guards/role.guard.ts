import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const matSnackBar = inject(MatSnackBar);

  const roles: string[] = route.data['roles'];
  const userRoles = authService.getRoles();
  if (roles.some(x => userRoles?.includes(x))) {
    return true;
  }
  matSnackBar.open('You do not have permission to view this page.', 'Ok', {
    duration: 3000,
  });
  router.navigate(['/']);
  return false;
};
