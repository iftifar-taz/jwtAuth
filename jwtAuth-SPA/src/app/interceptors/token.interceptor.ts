import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { routes } from '../app.routes';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.getToken()) {
    return next(req);
  }

  const clonedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authService.getToken()}`)
  });
  return next(clonedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        authService.refreshToken({
          email: authService.getUserDetail()?.email || '',
          token: authService.getToken() || '',
          refreshToken: authService.getRefreshToken() || ''
        }).subscribe({
          next: (response) => {
            if (response) {
              localStorage.setItem("user", JSON.stringify(response));
              const clonedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${authService.getToken()}`)
              });
              location.reload();
            }
          },
          error: (err: HttpErrorResponse) => {
            authService.logout();
            router.navigate(['/login']);
          }
        })
      }
      return throwError(() => err);
    })
  );
};
