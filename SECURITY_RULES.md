# 🔒 Règles de Sécurité - E-Commerce

## 📋 Permissions par Endpoint

### ✅ Endpoints Publics (Accessibles à tous)

**Authentification:**
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

**Catalogue (Lecture seule):**
- `GET /api/products` - Liste des produits
- `GET /api/products/{id}` - Détail d'un produit
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/{id}` - Détail d'une catégorie

**Documentation:**
- `GET /swagger-ui/**` - Interface Swagger
- `GET /v3/api-docs/**` - Documentation OpenAPI

### 🔐 Endpoints Protégés (Authentification requise)

**Profil utilisateur:**
- `GET /api/auth/me` - Informations de l'utilisateur connecté

### 👑 Endpoints Admin (Authentification + Rôle ADMIN)

**Gestion des produits:**
- `POST /api/products` - Créer un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

**Gestion des catégories:**
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/{id}` - Modifier une catégorie
- `DELETE /api/categories/{id}` - Supprimer une catégorie

**Administration:**
- `ALL /api/admin/**` - Tous les endpoints admin

## 🎯 Logique de Sécurité

### Principe
- **Lecture publique** : Tout le monde peut voir le catalogue
- **Écriture protégée** : Seuls les admins peuvent modifier

### Implémentation Backend

```java
// Lecture publique (GET)
.requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**").permitAll()

// Écriture admin uniquement (POST, PUT, DELETE)
.requestMatchers(HttpMethod.POST, "/api/products/**", "/api/categories/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT, "/api/products/**", "/api/categories/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/products/**", "/api/categories/**").hasRole("ADMIN")
```

### Implémentation Frontend

**Routes publiques:**
- `/` - Accueil
- `/catalogue` - Catalogue
- `/catalogue/:id` - Détail produit
- `/login` - Connexion
- `/register` - Inscription

**Routes protégées (authentification):**
- `/profile` - Profil utilisateur

**Routes admin (authentification + rôle ADMIN):**
- `/products` - Gestion des produits
- `/categories` - Gestion des catégories

## 👥 Rôles Utilisateurs

### USER (Utilisateur standard)
**Peut:**
- ✅ Voir le catalogue
- ✅ Voir les détails des produits
- ✅ S'inscrire / Se connecter
- ✅ Voir son profil
- ✅ Modifier ses informations

**Ne peut pas:**
- ❌ Créer/Modifier/Supprimer des produits
- ❌ Créer/Modifier/Supprimer des catégories
- ❌ Accéder aux pages d'administration

### ADMIN (Administrateur)
**Peut:**
- ✅ Tout ce qu'un USER peut faire
- ✅ Créer/Modifier/Supprimer des produits
- ✅ Créer/Modifier/Supprimer des catégories
- ✅ Accéder aux pages d'administration
- ✅ Gérer le catalogue complet

## 🔑 Comptes de Test

### Admin
```
Username: admin
Password: admin123
Role: ADMIN
```

### Utilisateur
```
Username: user
Password: user123
Role: USER
```

## 🛡️ Mécanismes de Sécurité

### Backend
1. **Spring Security 6** - Framework de sécurité
2. **JWT** - Tokens pour authentification stateless
3. **BCrypt** - Hashage des mots de passe
4. **CORS** - Configuration pour Angular (localhost:4200)
5. **CSRF** - Désactivé (API REST)

### Frontend
1. **AuthGuard** - Protection des routes authentifiées
2. **AdminGuard** - Protection des routes admin
3. **HTTP Interceptor** - Ajout automatique du token JWT
4. **Token Storage** - localStorage (auth_token, auth_user)

## 📱 Comportement de l'Interface

### Navbar Dynamique

**Non connecté:**
- Affiche: Catalogue
- Boutons: Connexion, Inscription

**Connecté (USER):**
- Affiche: Catalogue
- Menu utilisateur: Profil, Déconnexion

**Connecté (ADMIN):**
- Affiche: Catalogue, Produits, Catégories
- Badge "Admin" rouge
- Menu utilisateur: Profil, Déconnexion

### Redirections Automatiques

**Si non authentifié:**
- Accès à `/profile` → Redirige vers `/login`
- Accès à `/products` → Redirige vers `/login`
- Accès à `/categories` → Redirige vers `/login`

**Si authentifié mais pas admin:**
- Accès à `/products` → Redirige vers `/`
- Accès à `/categories` → Redirige vers `/`

**Si token expiré:**
- Toute requête HTTP → Redirige vers `/login`
- Token supprimé automatiquement

## 🔄 Flux d'Authentification

1. **Connexion**
   - Frontend envoie username/password
   - Backend valide et retourne JWT
   - Frontend stocke le token
   - Navbar se met à jour

2. **Requête Authentifiée**
   - Interceptor ajoute `Authorization: Bearer <token>`
   - Backend valide le token
   - Backend autorise ou refuse l'accès

3. **Déconnexion**
   - Frontend supprime le token
   - Navbar se met à jour
   - Redirection vers login

## ⚠️ Important

### En Production
1. **Changez le secret JWT** dans `application.properties`
2. **Changez les mots de passe** des comptes de test
3. **Activez HTTPS** pour toutes les communications
4. **Configurez CORS** avec votre domaine de production
5. **Ajoutez rate limiting** sur les endpoints de login

### Sécurité Renforcée
- Implémentez un système de refresh token
- Ajoutez une limite de tentatives de connexion
- Loggez les tentatives de connexion échouées
- Ajoutez une authentification à deux facteurs (2FA)
- Implémentez une politique de mots de passe forts

---

**✅ Configuration actuelle : Catalogue public, Administration protégée**
