import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  //

/**
 * Interface représentant une catégorie.
 */
export interface Category {
  /** Identifiant unique de la catégorie. */
  id: number;

  /** Nom de la catégorie. */
  name: string;
}

/**
 * Service responsable de la communication avec l'API des catégories.
 *
 * Fournit les opérations CRUD (Create, Read, Update, Delete)
 * pour gérer les catégories côté frontend.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  /** URL racine de l'API des catégories. */
  private apiUrl: string = `${environment.apiUrl}/categories`;  // ✅ Utilise environment

  constructor(private http: HttpClient) {}

  /** Liste toutes les catégories. */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  /**
   * Récupère une catégorie par ID.
   * @param id Identifiant de la catégorie à récupérer.
   */
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée une nouvelle catégorie.
   * @param category Objet `Category` à créer.
   */
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  /**
   * Met à jour une catégorie existante.
   * @param id Identifiant de la catégorie à mettre à jour.
   * @param category Nouvelle valeur de la catégorie.
   */
  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  /**
   * Supprime une catégorie par son identifiant.
   * @param id Identifiant de la catégorie à supprimer.
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
