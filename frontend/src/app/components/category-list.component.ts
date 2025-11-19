import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService, Category } from '../services/category.service';

/**
 * Composant d'affichage de la liste des catégories.
 *
 * @remarks
 * Ce composant affiche toutes les catégories disponibles
 * et permet à l'utilisateur d'éditer ou de supprimer une catégorie existante.
 *
 * Utilise {@link CategoryService} pour récupérer les données depuis le backend.
 */
@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.component.html', // Page HTML associée
  styleUrls: ['./category-list.component.css'] // Styles associés
})
export class CategoryListComponent implements OnInit {
  /** Liste des catégories à afficher. */
  categories: Category[] = [];

  /**
   * Crée une instance du composant.
   * @param categoryService Service utilisé pour communiquer avec le backend.
   */
  constructor(private categoryService: CategoryService) {}

  /** Méthode appelée lors de l'initialisation du composant. */
  ngOnInit(): void {
    this.loadCategories();
  }

  /** Charge toutes les catégories depuis le backend. */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Erreur lors du chargement des catégories :', err)
    });
  }

  /**
   * Redirige l'utilisateur vers la page d'édition d'une catégorie.
   * @param id Identifiant de la catégorie à modifier.
   */
  editCategory(id: number): void {
    window.location.href = `/categories/${id}/edit`;
  }

  /**
   * Supprime une catégorie après confirmation de l'utilisateur.
   * @param id Identifiant de la catégorie à supprimer.
   */
  deleteCategory(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          console.log('Catégorie supprimée avec succès');
          this.loadCategories(); // Recharge la liste
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la catégorie', err);
          alert('Impossible de supprimer cette catégorie. Elle est peut-être utilisée par des produits.');
        }
      });
    }
  }
}
