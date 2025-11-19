import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Pour *ngIf et *ngFor
import { HttpClientModule, HttpClient } from '@angular/common/http'; // ✅ Pour HttpClient
import { FormsModule } from '@angular/forms'; // ✅ Pour [(ngModel)]
import { RouterModule } from '@angular/router'; // ✅ Pour routerLink

/**
 * Composant standalone gérant l’affichage du catalogue des produits.
 * Il permet de rechercher et filtrer les produits par catégorie.
 */
@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  /** Liste de toutes les catégories disponibles. */
  categories: any[] = [];

  /** Liste complète des produits du catalogue. */
  products: any[] = [];

  /** Liste des produits filtrés affichés. */
  filteredProducts: any[] = [];

  /** Champ de recherche libre (nom ou marque). */
  search: string = '';

  /** ID de la catégorie sélectionnée. */
  selectedCategoryId: number | undefined;

  /** Indicateur de chargement. */
  isLoading = false;

  /** Message d'erreur éventuel. */
  errorMessage = '';

  constructor(private http: HttpClient) {}

  /**
   * Au chargement du composant :
   * - Récupère les catégories
   * - Récupère tous les produits
   */
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  /**
   * Récupère la liste des catégories depuis le backend.
   */
  loadCategories(): void {
    this.http.get<any[]>('http://localhost:8080/api/categories').subscribe({
      next: (data) => {
        this.categories = data;
        console.log('✅ Catégories chargées :', data);
      },
      error: (err) => console.error('❌ Erreur chargement catégories :', err)
    });
  }

  /**
   * Récupère tous les produits depuis le backend.
   * Exclut les produits sans catégorie définie.
   */
  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<any[]>('http://localhost:8080/api/products').subscribe({
      next: (data) => {
        // ⚙️ On enlève les produits sans catégorie définie
        this.products = data.filter(p => p.category && p.category.name);
        // Par défaut, on affiche tous les produits
        this.filteredProducts = [...this.products];
        this.isLoading = false;
        console.log('✅ Produits chargés :', this.products);
      },
      error: (err) => {
        console.error('❌ Erreur chargement produits :', err);
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.isLoading = false;
      }
    });
  }

  /**
   * Méthode appelée lorsqu'un filtre de catégorie change.
   * Applique le filtrage sur les produits.
   */
  onFilterChange(): void {
    this.onSearch();
  }

  /**
   * Méthode appelée lorsqu'on effectue une recherche manuelle.
   * Filtre les produits par recherche texte et catégorie.
   */
  onSearch(): void {
    this.filteredProducts = this.products.filter((p) => {
      const matchesSearch =
        this.search === '' ||
        p.name.toLowerCase().includes(this.search.toLowerCase()) ||
        (p.brandName && p.brandName.toLowerCase().includes(this.search.toLowerCase()));

      const matchesCategory =
        !this.selectedCategoryId || p.category?.id === this.selectedCategoryId;

      return matchesSearch && matchesCategory;
    });
  }

  /**
   * Réinitialise tous les filtres et affiche tous les produits.
   */
  resetFilters(): void {
    this.selectedCategoryId = undefined;
    this.search = '';
    this.filteredProducts = [...this.products];
  }
}
