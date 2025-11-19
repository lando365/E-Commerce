import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private isBrowser: boolean;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ========== Gestion du TOKEN ==========

  saveToken(token: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  removeToken(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.TOKEN_KEY);
    }
  }

  hasToken(): boolean {
    if (this.isBrowser) {
      return sessionStorage.getItem(this.TOKEN_KEY) !== null;
    }
    return false;
  }

  // ========== Gestion de l'UTILISATEUR ==========

  saveUser(user: User): void {
    if (this.isBrowser) {
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (this.isBrowser) {
      const userStr = sessionStorage.getItem(this.USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Erreur lors du parsing de l\'utilisateur:', error);
          return null;
        }
      }
    }
    return null;
  }

  removeUser(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.USER_KEY);
    }
  }

  // ========== Méthodes utilitaires ==========

  isLoggedIn(): boolean {
    return this.hasToken() && this.getUser() !== null;
  }

  // Nettoyer tout (déconnexion complète)
  clear(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
      // Ou utilisez sessionStorage.clear() si vous voulez tout supprimer
    }
  }

  // Sauvegarder token et user en une seule fois
  saveAuthData(token: string, user: User): void {
    this.saveToken(token);
    this.saveUser(user);
  }

  // Supprimer toutes les données d'authentification
  clearAuthData(): void {
    this.removeToken();
    this.removeUser();
  }
}
