import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();

  console.log('🔍 Interceptor - URL:', req.url);
  console.log('🔍 Interceptor - Token:', token ? 'EXISTS (length: ' + token.length + ')' : 'NULL');

  // Cloner la requête et ajouter le token si disponible
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Interceptor - Authorization header added');
  } else {
    console.warn('⚠️ Interceptor - No token found!');
  }

  return next(req).pipe(
    catchError((error) => {
      console.error('❌ Interceptor - Error:', error.status, error.message);
      if (error.status === 401) {
        // Token invalide ou expiré
        tokenService.clear();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
