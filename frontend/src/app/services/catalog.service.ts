import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  brandName: string;
  price: number;
  imageUrl: string;
  category?: Category; //  pour inclure l’objet catégorie complet
}

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  //  utilise les chemins exposés par ton backend Spring Boot
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  // 🔹 Récupère les produits, avec filtres optionnels
  getProducts(categoryId?: number, search?: string): Observable<Product[]> {
    let params = new HttpParams();

    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }

    return this.http.get<Product[]>(this.baseUrl, { params });
  }

  // 🔹 Récupère une catégorie
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }

  // 🔹 Détail d’un produit
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
}
