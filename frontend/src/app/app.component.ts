import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold" routerLink="/">🛍️ E-Commerce</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/catalogue" routerLinkActive="active">📦 Catalogue</a>
              </li>
              <li class="nav-item" *ngIf="isAdmin">
                <a class="nav-link" routerLink="/products" routerLinkActive="active">🛒 Produits</a>
              </li>
              <li class="nav-item" *ngIf="isAdmin">
                <a class="nav-link" routerLink="/categories" routerLinkActive="active">📂 Catégories</a>
              </li>
            </ul>
            
            <ul class="navbar-nav ms-auto">
              <ng-container *ngIf="currentUser; else notLoggedIn">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" 
                     data-bs-toggle="dropdown" aria-expanded="false">
                    👤 {{ currentUser.username }}
                    <span class="badge bg-danger ms-1" *ngIf="isAdmin">Admin</span>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" routerLink="/profile">👤 Mon Profil</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" (click)="logout($event)">🚪 Déconnexion</a></li>
                  </ul>
                </li>
              </ng-container>
              
              <ng-template #notLoggedIn>
                <li class="nav-item">
                  <a class="nav-link" routerLink="/login">🔐 Connexion</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link btn btn-primary text-white ms-2" routerLink="/register">📝 Inscription</a>
                </li>
              </ng-template>
            </ul>
          </div>
        </div>
      </nav>

      <main class="container py-4 flex-fill">
        <router-outlet></router-outlet>
      </main>

      <footer class="text-center small py-2 border-top mt-auto">
        <a routerLink="/privacy-policy" class="mx-2 text-decoration-none text-muted">Politique de confidentialité</a>
        <a routerLink="/terms-and-conditions" class="mx-2 text-decoration-none text-muted">Conditions d'utilisation</a>
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
  title: string = 'Site e-commerce';
  currentUser: User | null = null;
  isAdmin = false;

  constructor(
    private titleService: Title,
    private authService: AuthService,
    private router: Router
  ) {
    this.titleService.setTitle(this.title);
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
