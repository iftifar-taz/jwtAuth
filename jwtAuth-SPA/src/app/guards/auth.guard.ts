import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const matSnackBar = inject(MatSnackBar);
  if (authService.isLoggedIn()) {
    return true;
  }

  matSnackBar.open('You must be logged in to view this page.', 'Ok', {
    duration: 3000,
  });
  router.navigate(['/']);
  return false;
};
