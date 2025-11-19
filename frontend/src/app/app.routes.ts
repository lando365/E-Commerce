import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoryListComponent } from './components/category-list.component';
import { CategoryFormComponent } from './components/category-form.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Routes authentification
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // Routes produits (admin uniquement)
  { path: 'products', component: ProductListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'products/new', component: ProductFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'products/:id/edit', component: ProductFormComponent, canActivate: [authGuard, adminGuard] },

  // Routes catégories (admin uniquement)
  { path: 'categories', component: CategoryListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'categories/new', component: CategoryFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'categories/:id/edit', component: CategoryFormComponent, canActivate: [authGuard, adminGuard] },

  // Catalogue et détails (public)
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'catalogue/:id', component: ProductDetailComponent },

  // Pages statiques
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },

  // Redirection par défaut
  { path: '**', redirectTo: 'catalogue' }
];
