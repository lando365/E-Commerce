import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService, Category } from '../services/category.service';

/**
 * Composant de formulaire pour la création, la modification ou la suppression d'une catégorie.
 *
 * @remarks
 * Ce composant gère le cycle de vie complet d'une catégorie :
 * - Chargement des données si un `id` est présent (mode édition)
 * - Enregistrement d'une nouvelle catégorie (mode création)
 * - Suppression de la catégorie
 *
 * Il communique avec le backend via {@link CategoryService}.
 */
@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="container py-4">
      <div class="col-lg-8 mx-auto">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h1 class="h4 mb-4">
              {{ category.id ? '✏️ Modifier la catégorie' : '➕ Ajouter une catégorie' }}
            </h1>

            <form (ngSubmit)="saveCategory()" #categoryForm="ngForm">
              <!-- Champ Nom -->
              <div class="mb-3">
                <label for="name" class="form-label">Nom</label>
                <input
                  id="name"
                  name="name"
                  class="form-control"
                  [(ngModel)]="category.name"
                  required
                  placeholder="Ex: Informatique"
                />
                <div class="text-danger small" *ngIf="categoryForm.submitted && !category.name">
                  Le nom est requis.
                </div>
              </div>

              <!-- Boutons -->
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success">
                  <i class="bi bi-check-circle"></i>
                  {{ category.id ? 'Mettre à jour' : 'Créer' }}
                </button>

                <button type="button" class="btn btn-secondary" (click)="cancel()">
                  Annuler
                </button>

                <button
                  *ngIf="category.id"
                  type="button"
                  class="btn btn-outline-danger ms-auto"
                  (click)="deleteCategory()"
                >
                  <i class="bi bi-trash"></i> Supprimer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `
})
export class CategoryFormComponent implements OnInit {
  category: Partial<Category> = { name: '' };

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryService.getCategoryById(+id).subscribe({
        next: (data) => (this.category = data),
        error: (err) => console.error('Erreur de chargement', err)
      });
    }
  }

  saveCategory(): void {
    if (!this.category.name?.trim()) {
      return;
    }

    if (this.category.id) {
      // Mise à jour
      this.categoryService.updateCategory(this.category.id, this.category as Category).subscribe({
        next: () => this.router.navigate(['/categories']),
        error: (err) => console.error('Erreur update', err)
      });
    } else {
      // Création
      this.categoryService.createCategory(this.category as Category).subscribe({
        next: () => this.router.navigate(['/categories']),
        error: (err) => console.error('Erreur création', err)
      });
    }
  }

  deleteCategory(): void {
    if (!this.category.id) return;

    if (confirm('Supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(this.category.id).subscribe({
        next: () => this.router.navigate(['/categories']),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
