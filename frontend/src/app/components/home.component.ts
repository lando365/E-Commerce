import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <!-- HERO -->
    <div class="p-5 mb-4 bg-white rounded-3 shadow-sm">
      <div class="container py-5">
        <h1 class="display-5 fw-bold">Bienvenue</h1>
        <p class="col-lg-7 fs-5 text-muted" *ngIf="isAdmin">
          Gérez vos <strong>catégories</strong> et <strong>produits</strong> en toute simplicité.
        </p>
        <p class="col-lg-7 fs-5 text-muted" *ngIf="!isAdmin">
          Découvrez notre <strong>catalogue</strong> de produits.
        </p>
      </div>
    </div>

    <!-- CARTES D'ACCÈS RAPIDE ADMIN -->
    <div class="row g-3" *ngIf="isAdmin">
      <div class="col-md-6">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">📂 Catégories</h5>
            <p class="card-text text-muted">
              Crée, modifie et supprime les catégories de ton catalogue.
            </p>
            <a routerLink="/categories" class="btn btn-outline-primary">
              Gérer les catégories
            </a>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">🛒 Produits</h5>
            <p class="card-text text-muted">
              Ajoute des produits, associe-les à une catégorie et fixe les prix.
            </p>
            <a routerLink="/products" class="btn btn-outline-success">
              Gérer les produits
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- CARTE CATALOGUE POUR UTILISATEURS NON-ADMIN -->
    <div class="row g-3" *ngIf="!isAdmin">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body text-center py-5">
            <h5 class="card-title mb-3">📦 Catalogue de Produits</h5>
            <p class="card-text text-muted mb-4">
              Découvrez notre sélection de produits
            </p>
            <a routerLink="/catalogue" class="btn btn-primary btn-lg">
              Voir le Catalogue
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    
    // S'abonner aux changements d'utilisateur
    this.authService.currentUser$.subscribe(() => {
      this.isAdmin = this.authService.isAdmin();
    });
  }
}
