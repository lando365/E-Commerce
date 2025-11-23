import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.service';
import { environment } from '../../environments/environment';  //

/**
 * Interface représentant un produit.
 */
export interface Product {
  /** Identifiant unique du produit (optionnel lors de la création). */
  id?: number;

  /** Nom du produit (ex. "T-shirt oversize"). */
  name: string;

  /** Nom de la marque du produit (ex. "Nike"). */
  brandName: string;

  /** Prix du produit en euros. */
  price: number;

  /** URL de l'image représentant le produit. */
  imageUrl: string;

  /** Catégorie à laquelle le produit appartient. */
  category: Category | null;
}

/**
 * Service Angular responsable des opérations CRUD sur les produits.
 *
 * Fournit des méthodes pour :
 * - Récupérer la liste des produits
 * - Récupérer un produit par ID
 * - Créer, modifier ou supprimer un produit
 *
 * Communique avec le backend Spring Boot via HTTP.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  /** URL racine de l'API des produits. */
  private apiUrl: string = `${environment.apiUrl}/products`;  // ✅ Utilise environment

  constructor(private http: HttpClient) {}

  /** Récupère la liste complète des produits. */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Récupère un produit par son identifiant.
   * @param id Identifiant du produit à récupérer.
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau produit.
   * @param product Produit à ajouter à la base de données.
   */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Met à jour un produit existant.
   * @param id Identifiant du produit à mettre à jour.
   * @param product Données modifiées du produit.
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Supprime un produit par son identifiant.
   * @param id Identifiant du produit à supprimer.
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
