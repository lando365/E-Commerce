import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Category, CategoryService } from '../../services/category.service';
import { ProductService, Product as ProductDto } from '../../services/product.service';

// On utilise le type Product du service pour rester aligné avec l'API
type Product = ProductDto;

/**
 * Composant standalone Angular gérant le formulaire de création ou d’édition d’un produit.
 * - Charge la liste des catégories depuis le backend.
 * - Permet de créer ou modifier un produit.
 * - Redirige vers la liste des produits après enregistrement.
 */
@Component({
  selector: 'app-product-form',
  standalone: true, // composant autonome (Angular 17)
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  /** Liste des catégories disponibles (récupérées depuis le backend). */
  categories: Category[] = [];

  /** Produit à créer ou modifier. */
  product: Product = {
    name: '',
    brandName: '',
    price: 0,
    imageUrl: '',
    category: { id: 0, name: '' }
  };

  /** Id de catégorie sélectionné (liaison au select) */
  selectedCategoryId: number | null = 0;

  /** Indique si le formulaire est en mode édition. */
  isEditMode = false;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Méthode appelée lors de l’initialisation du composant :
   * - Charge les catégories disponibles.
   * - Vérifie si un ID est présent pour activer le mode édition.
   */
  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadProduct(+id);
    }
  }

  /**
   * Récupère la liste des catégories depuis le backend Spring Boot.
   */
  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('✅ Catégories chargées :', data);
      },
      error: (err) => console.error('❌ Erreur chargement catégories', err)
    });
  }

  /**
   * Charge les informations d’un produit existant (mode édition).
   * @param id Identifiant du produit à charger.
   */
  private loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        // Synchroniser l'id de catégorie pour le select
        this.selectedCategoryId = (data.category as any)?.id ?? 0;
        console.log('✏️ Produit chargé :', data);
      },
      error: (err) => console.error('❌ Erreur chargement du produit', err)
    });
  }

  /**
   * Envoie les données du formulaire au backend :
   * - Si `isEditMode` est vrai, effectue un PUT.
   * - Sinon, effectue un POST pour créer un produit.
   */
  save(): void {
    // Validation des champs obligatoires
    if (!this.product.name || this.product.name.trim().length < 2) {
      alert('❌ Le nom du produit est obligatoire (minimum 2 caractères)');
      return;
    }

    if (!this.product.brandName || this.product.brandName.trim().length < 2) {
      alert('❌ La marque est obligatoire (minimum 2 caractères)');
      return;
    }

    if (!this.product.price || this.product.price <= 0) {
      alert('❌ Le prix doit être supérieur à 0');
      return;
    }

    if (!this.product.imageUrl || this.product.imageUrl.trim() === '') {
      alert('❌ L\'URL de l\'image est obligatoire');
      return;
    }

    const hasCategory = this.selectedCategoryId != null && this.selectedCategoryId > 0;
    if (!hasCategory) {
      alert('❌ Veuillez sélectionner une catégorie avant d\'enregistrer.');
      return;
    }

    // Reporter la catégorie sélectionnée dans l'objet produit avant envoi
    this.product.category = { id: this.selectedCategoryId as number, name: '' } as any;

    if (this.isEditMode && this.product.id) {
      //  Mise à jour d'un produit existant
      this.productService.updateProduct(this.product.id, this.product).subscribe({
        next: () => {
          console.log('✅ Produit mis à jour avec succès !');
          alert('✅ Produit mis à jour avec succès !');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour du produit', err);
          const errorMsg = err.error?.join('\n') || 'Erreur lors de la mise à jour du produit.';
          alert('❌ ' + errorMsg);
        }
      });
    } else {
      // Création d'un nouveau produit
      this.productService.createProduct(this.product).subscribe({
        next: () => {
          console.log('✅ Produit créé avec succès !');
          alert('✅ Produit créé avec succès !');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la création du produit', err);
          const errorMsg = err.error?.join('\n') || 'Erreur lors de la création du produit. Vérifiez les champs.';
          alert('❌ ' + errorMsg);
        }
      });
    }
  }
}
