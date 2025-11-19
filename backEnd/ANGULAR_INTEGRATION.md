# 🔗 Intégration avec Angular - Guide Complet

## 📋 Vue d'ensemble

Ce guide vous montre comment intégrer le système d'authentification JWT avec votre frontend Angular.

## 🎯 Architecture Frontend

```
Angular App
├── services/
│   ├── auth.service.ts       (Gestion authentification)
│   ├── token.service.ts      (Gestion tokens)
│   └── http-interceptor.ts   (Ajout automatique du token)
├── guards/
│   ├── auth.guard.ts         (Protection des routes)
│   └── admin.guard.ts        (Protection routes admin)
├── models/
│   ├── user.model.ts
│   ├── login-request.model.ts
│   └── auth-response.model.ts
└── components/
    ├── login/
    ├── register/
    └── profile/
```

## 📦 1. Modèles TypeScript

### user.model.ts
```typescript
export interface User {
  id?: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
}
```

### auth-request.models.ts
```typescript
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
```

### auth-response.model.ts
```typescript
export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  message: string;
}
```

## 🔧 2. Services

### token.service.ts
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  saveUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}
```

### auth.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { TokenService } from './token.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(this.tokenService.getUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.API_URL}/me`);
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  isAdmin(): boolean {
    const user = this.tokenService.getUser();
    return user && user.role === 'ADMIN';
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.tokenService.saveToken(response.token);
    const user = {
      username: response.username,
      email: response.email,
      role: response.role
    };
    this.tokenService.saveUser(user);
    this.currentUserSubject.next(user);
  }
}
```

## 🔐 3. HTTP Interceptor

### auth.interceptor.ts
```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token invalide ou expiré
          this.tokenService.clear();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
```

### Enregistrement de l'interceptor (app.config.ts ou app.module.ts)

**Pour Angular 17+ (standalone):**
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

**Pour Angular < 17 (NgModule):**
```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
```

## 🛡️ 4. Guards

### auth.guard.ts
```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
}
```

### admin.guard.ts
```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
```

## 🎨 5. Composants

### login.component.ts
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Connexion réussie', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur de connexion';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
```

### login.component.html
```html
<div class="login-container">
  <h2>Connexion</h2>
  
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="username">Nom d'utilisateur</label>
      <input 
        type="text" 
        id="username" 
        formControlName="username"
        class="form-control"
        [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
      />
      <div class="invalid-feedback" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
        Le nom d'utilisateur est requis (min. 3 caractères)
      </div>
    </div>

    <div class="form-group">
      <label for="password">Mot de passe</label>
      <input 
        type="password" 
        id="password" 
        formControlName="password"
        class="form-control"
        [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
      />
      <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
        Le mot de passe est requis (min. 6 caractères)
      </div>
    </div>

    <div class="alert alert-danger" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>

    <button 
      type="submit" 
      class="btn btn-primary" 
      [disabled]="loginForm.invalid || loading"
    >
      <span *ngIf="loading">Connexion en cours...</span>
      <span *ngIf="!loading">Se connecter</span>
    </button>
  </form>

  <p class="mt-3">
    Pas encore de compte ? <a routerLink="/register">S'inscrire</a>
  </p>
</div>
```

### register.component.ts
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
```

## 🗺️ 6. Configuration des Routes

### app.routes.ts
```typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
```

## 🎯 7. Navbar avec Authentification

### navbar.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  currentUser$: Observable<any>;
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
```

### navbar.component.html
```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" routerLink="/">E-Commerce</a>
    
    <div class="navbar-nav ms-auto">
      <ng-container *ngIf="currentUser$ | async as user; else notLoggedIn">
        <span class="navbar-text me-3">
          Bonjour, {{ user.username }}
          <span class="badge bg-primary ms-2" *ngIf="isAdmin">Admin</span>
        </span>
        <a class="nav-link" routerLink="/dashboard">Dashboard</a>
        <a class="nav-link" routerLink="/admin" *ngIf="isAdmin">Admin</a>
        <a class="nav-link" routerLink="/profile">Profil</a>
        <button class="btn btn-outline-light" (click)="logout()">
          Déconnexion
        </button>
      </ng-container>
      
      <ng-template #notLoggedIn>
        <a class="nav-link" routerLink="/login">Connexion</a>
        <a class="nav-link" routerLink="/register">Inscription</a>
      </ng-template>
    </div>
  </div>
</nav>
```

## 🔄 8. Gestion des Erreurs

### error-handler.service.ts
```typescript
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  handleError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      return `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 401) {
        return 'Non autorisé. Veuillez vous connecter.';
      } else if (error.status === 403) {
        return 'Accès refusé.';
      } else if (error.status === 404) {
        return 'Ressource non trouvée.';
      } else if (error.error?.message) {
        return error.error.message;
      } else {
        return `Erreur serveur: ${error.status}`;
      }
    }
  }
}
```

## 📱 9. Exemple Complet d'Utilisation

### profile.component.ts
```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;
  error = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du profil';
        this.loading = false;
      }
    });
  }
}
```

## 🎨 10. Styles CSS (Optionnel)

### login.component.css
```css
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

button[type="submit"] {
  width: 100%;
  margin-top: 10px;
}
```

## ✅ Checklist d'Intégration

- [ ] Créer les modèles TypeScript
- [ ] Implémenter TokenService
- [ ] Implémenter AuthService
- [ ] Créer l'interceptor HTTP
- [ ] Créer les guards (AuthGuard, AdminGuard)
- [ ] Créer les composants (Login, Register)
- [ ] Configurer les routes
- [ ] Ajouter la navbar avec authentification
- [ ] Tester la connexion
- [ ] Tester l'inscription
- [ ] Tester la protection des routes
- [ ] Tester la déconnexion

## 🚀 Commandes Angular

```bash
# Générer les services
ng generate service services/auth
ng generate service services/token

# Générer les guards
ng generate guard guards/auth
ng generate guard guards/admin

# Générer les composants
ng generate component components/login
ng generate component components/register
ng generate component components/navbar

# Générer l'interceptor
ng generate interceptor interceptors/auth
```

## 🔍 Debugging

### Vérifier le token dans le localStorage
```typescript
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('auth_user'));
```

### Vérifier les headers HTTP
Ouvrez les DevTools → Network → Sélectionnez une requête → Headers
Vérifiez la présence de: `Authorization: Bearer <token>`

## 📚 Ressources

- [Angular HttpClient](https://angular.io/guide/http)
- [Angular Guards](https://angular.io/guide/router#preventing-unauthorized-access)
- [Angular Interceptors](https://angular.io/guide/http#intercepting-requests-and-responses)
- [RxJS Operators](https://rxjs.dev/guide/operators)

---

**Votre intégration Angular est prête ! 🎉**
