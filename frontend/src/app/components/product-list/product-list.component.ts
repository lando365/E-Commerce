import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

/**
 * Composant d’affichage de la liste des produits.
 *
 * @remarks
 * Ce composant permet d’afficher tous les produits.
 * L’utilisateur peut :
 * - Consulter la liste des produits
 * - Accéder à la page d’édition d’un produit
 * - Supprimer un produit existant
 *
 * Il interagit directement avec le backend via {@link ProductService}.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {

  /** Tableau contenant la liste complète des produits. */
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /** Charge la liste des produits depuis le backend. */
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
      }
    });
  }

  /** Redirige vers le formulaire d’édition d’un produit. */
  editProduct(id: number): void {
    this.router.navigate(['/products', id, 'edit']);
  }

  /** Supprime un produit après confirmation. */
  deleteProduct(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Produit supprimé avec succès');
          this.loadProducts(); // Recharge la liste
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du produit', err);
        }
      });
    }
  }

  /** Gère les erreurs de chargement d'image en affichant une image par défaut. */
  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }
}
