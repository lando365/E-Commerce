# 🔐 Système d'Authentification Angular - Installé

## ✅ Ce qui a été implémenté

### Fichiers créés

**Modèles** (`src/app/models/`)
- ✅ `user.model.ts` - Interfaces User, LoginRequest, RegisterRequest, AuthResponse

**Services** (`src/app/services/`)
- ✅ `auth.service.ts` - Service d'authentification
- ✅ `token.service.ts` - Gestion des tokens JWT

**Intercepteurs** (`src/app/interceptors/`)
- ✅ `auth.interceptor.ts` - Ajout automatique du token JWT

**Guards** (`src/app/guards/`)
- ✅ `auth.guard.ts` - Protection des routes authentifiées
- ✅ `admin.guard.ts` - Protection des routes admin

**Composants** (`src/app/components/`)
- ✅ `login/` - Page de connexion
- ✅ `register/` - Page d'inscription
- ✅ `profile/` - Page de profil utilisateur

**Configuration**
- ✅ `app.config.ts` - Intercepteur HTTP configuré
- ✅ `app.routes.ts` - Routes avec guards
- ✅ `app.component.ts` - Navbar avec authentification

## 🎯 Fonctionnalités

### Authentification
- ✅ Connexion avec username/password
- ✅ Inscription de nouveaux utilisateurs
- ✅ Déconnexion
- ✅ Profil utilisateur
- ✅ Gestion automatique des tokens JWT

### Sécurité
- ✅ Protection des routes par authentification
- ✅ Protection des routes admin
- ✅ Ajout automatique du token dans les requêtes HTTP
- ✅ Redirection automatique si non authentifié
- ✅ Gestion des erreurs 401 (token expiré)

### Interface
- ✅ Navbar dynamique (affiche connexion/profil selon l'état)
- ✅ Badge "Admin" pour les administrateurs
- ✅ Menu déroulant utilisateur
- ✅ Formulaires avec validation
- ✅ Messages d'erreur
- ✅ Indicateurs de chargement

## 🚀 Utilisation

### Démarrer l'application

```bash
cd frontEnd
npm install  # Si pas déjà fait
ng serve
```

Ouvrez http://localhost:4200

### Tester l'authentification

1. **Inscription**
   - Allez sur http://localhost:4200/register
   - Créez un compte
   - Vous serez automatiquement connecté

2. **Connexion**
   - Allez sur http://localhost:4200/login
   - Utilisez les comptes de test du backend:
     - Admin: `admin` / `admin123`
     - User: `user` / `user123`

3. **Profil**
   - Une fois connecté, cliquez sur votre nom dans la navbar
   - Sélectionnez "Mon Profil"
   - Modifiez vos informations

4. **Déconnexion**
   - Cliquez sur votre nom dans la navbar
   - Sélectionnez "Déconnexion"

## 🔒 Protection des Routes

### Routes publiques (accessibles à tous)
- `/` - Page d'accueil
- `/catalogue` - Catalogue produits
- `/catalogue/:id` - Détail produit
- `/login` - Connexion
- `/register` - Inscription

### Routes protégées (authentification requise)
- `/profile` - Profil utilisateur

### Routes admin (authentification + rôle ADMIN requis)
- `/products` - Liste des produits
- `/products/new` - Nouveau produit
- `/products/:id/edit` - Éditer produit
- `/categories` - Liste des catégories
- `/categories/new` - Nouvelle catégorie
- `/categories/:id/edit` - Éditer catégorie

## 📱 Navbar Dynamique

La navbar s'adapte automatiquement selon l'état de connexion :

**Non connecté:**
- Affiche "Connexion" et "Inscription"
- Affiche uniquement le catalogue

**Connecté (USER):**
- Affiche le nom d'utilisateur
- Menu déroulant avec "Mon Profil" et "Déconnexion"
- Affiche le catalogue

**Connecté (ADMIN):**
- Affiche le nom d'utilisateur + badge "Admin"
- Menu déroulant avec "Mon Profil" et "Déconnexion"
- Affiche Catalogue, Produits et Catégories

## 🔧 Configuration

### URL de l'API Backend

Par défaut, l'API est configurée sur `http://localhost:8080`

Pour changer l'URL, modifiez dans `auth.service.ts`:
```typescript
private readonly API_URL = 'http://localhost:8080/api/auth';
```

### Stockage des Tokens

Les tokens JWT sont stockés dans le `localStorage`:
- `auth_token` - Token JWT
- `auth_user` - Informations utilisateur

## 🎨 Personnalisation

### Modifier les styles

Les composants utilisent Bootstrap 5. Vous pouvez personnaliser:
- `login.component.css`
- `register.component.css`
- `profile.component.css`

### Ajouter des champs au profil

1. Modifiez `user.model.ts` pour ajouter des champs
2. Mettez à jour `profile.component.html` et `.ts`
3. Créez un endpoint backend pour la mise à jour

## 🐛 Dépannage

### Le token n'est pas envoyé
- Vérifiez que l'intercepteur est bien configuré dans `app.config.ts`
- Vérifiez la console du navigateur

### Redirection infinie vers /login
- Vérifiez que le token est bien stocké dans localStorage
- Vérifiez que le backend retourne bien un token valide

### Erreur CORS
- Vérifiez que le backend autorise `http://localhost:4200`
- Configuration dans `SecurityConfig.java`

### Le dropdown ne fonctionne pas
- Assurez-vous que Bootstrap JS est chargé
- Vérifiez dans `index.html`

## 📚 Structure du Code

```
src/app/
├── models/
│   └── user.model.ts           # Interfaces TypeScript
├── services/
│   ├── auth.service.ts         # Logique d'authentification
│   └── token.service.ts        # Gestion des tokens
├── interceptors/
│   └── auth.interceptor.ts     # Ajout automatique du token
├── guards/
│   ├── auth.guard.ts           # Protection routes authentifiées
│   └── admin.guard.ts          # Protection routes admin
├── components/
│   ├── login/                  # Composant de connexion
│   ├── register/               # Composant d'inscription
│   └── profile/                # Composant de profil
├── app.component.ts            # Navbar avec authentification
├── app.routes.ts               # Routes avec guards
└── app.config.ts               # Configuration de l'app
```

## ✨ Fonctionnalités Avancées

### Observable currentUser$

Vous pouvez vous abonner à l'utilisateur courant n'importe où:

```typescript
constructor(private authService: AuthService) {
  this.authService.currentUser$.subscribe(user => {
    console.log('Utilisateur actuel:', user);
  });
}
```

### Vérifier les rôles

```typescript
if (this.authService.isAdmin()) {
  // Code pour admin uniquement
}

if (this.authService.isLoggedIn()) {
  // Code pour utilisateurs connectés
}
```

### Récupérer l'utilisateur actuel

```typescript
const user = this.authService.getCurrentUserValue();
console.log(user?.username);
```

## 🎯 Prochaines Étapes

Pour améliorer le système:

1. **Refresh Token** - Renouveler automatiquement le token
2. **Remember Me** - Option "Se souvenir de moi"
3. **Mot de passe oublié** - Réinitialisation par email
4. **Changement de mot de passe** - Dans le profil
5. **Avatar utilisateur** - Upload d'image de profil
6. **Historique des connexions** - Afficher les dernières connexions

## 📞 Support

Tout est prêt ! Lancez le backend et le frontend pour tester.

**Backend:** `mvn spring-boot:run` (port 8080)
**Frontend:** `ng serve` (port 4200)

---

**🎉 Votre système d'authentification est opérationnel !**
