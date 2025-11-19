# Guide d'Authentification - API E-Commerce

## 🔐 Vue d'ensemble

Ce projet implémente un système d'authentification sécurisé avec **Spring Security 6** et **JWT (JSON Web Tokens)**.

## 📋 Fonctionnalités

- ✅ Inscription d'utilisateurs
- ✅ Connexion avec JWT
- ✅ Authentification basée sur les tokens
- ✅ Gestion des rôles (USER, ADMIN)
- ✅ Endpoints sécurisés
- ✅ Validation des données
- ✅ Gestion des erreurs

## 🚀 Endpoints disponibles

### 1. Inscription (`POST /api/auth/register`)

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "USER",
  "message": "Inscription réussie"
}
```

### 2. Connexion (`POST /api/auth/login`)

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "USER",
  "message": "Connexion réussie"
}
```

### 3. Profil utilisateur (`GET /api/auth/me`)

**Headers:**
```
Authorization: Bearer <votre_token_jwt>
```

**Response (200 OK):**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "role": "USER"
}
```

### 4. Déconnexion (`POST /api/auth/logout`)

**Headers:**
```
Authorization: Bearer <votre_token_jwt>
```

**Response (200 OK):**
```
Déconnexion réussie
```

## 🔑 Utilisation du JWT

### Comment utiliser le token JWT

1. **Après l'inscription ou la connexion**, vous recevez un token JWT
2. **Incluez ce token** dans l'en-tête `Authorization` pour toutes les requêtes protégées:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Exemple avec cURL

```bash
# Inscription
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Connexion
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'

# Accès à un endpoint protégé
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

### Exemple avec JavaScript (Fetch API)

```javascript
// Inscription
const register = async () => {
  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Connexion
const login = async () => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'johndoe',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Requête authentifiée
const getProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8080/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// Déconnexion
const logout = () => {
  localStorage.removeItem('token');
};
```

## 🛡️ Sécurité

### Configuration actuelle

- **Algorithme JWT**: HS256
- **Durée de validité du token**: 24 heures (86400000 ms)
- **Encodage du mot de passe**: BCrypt
- **CORS**: Activé pour localhost:4200 et localhost:3000

### Endpoints publics (sans authentification)

- `/api/auth/**` - Tous les endpoints d'authentification
- `/swagger-ui/**` - Documentation Swagger
- `/v3/api-docs/**` - Documentation OpenAPI

### Endpoints protégés

- Tous les autres endpoints nécessitent un token JWT valide
- Les endpoints `/api/admin/**` nécessitent le rôle ADMIN

## 🎯 Rôles disponibles

- **USER**: Utilisateur standard (rôle par défaut)
- **ADMIN**: Administrateur avec privilèges étendus

## ⚙️ Configuration

### application.properties

```properties
# JWT Configuration
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
```

**Important**: En production, utilisez une clé secrète forte et stockez-la dans les variables d'environnement.

## 🧪 Tests avec Swagger

Accédez à la documentation Swagger:
```
http://localhost:8080/swagger-ui.html
```

1. Utilisez l'endpoint `/api/auth/register` ou `/api/auth/login`
2. Copiez le token reçu
3. Cliquez sur le bouton "Authorize" en haut
4. Entrez: `Bearer VOTRE_TOKEN`
5. Testez les endpoints protégés

## 📝 Validation des données

### Règles de validation

**Username:**
- Obligatoire
- Entre 3 et 50 caractères
- Unique

**Email:**
- Obligatoire
- Format email valide
- Unique

**Password:**
- Obligatoire
- Minimum 6 caractères

## 🚨 Gestion des erreurs

### Codes de statut HTTP

- `200 OK`: Requête réussie
- `201 Created`: Ressource créée (inscription)
- `400 Bad Request`: Données invalides
- `401 Unauthorized`: Non authentifié ou credentials invalides
- `403 Forbidden`: Accès refusé (rôle insuffisant)
- `404 Not Found`: Ressource non trouvée
- `500 Internal Server Error`: Erreur serveur

### Exemples de réponses d'erreur

**Validation échouée (400):**
```json
{
  "username": "Le nom d'utilisateur doit contenir entre 3 et 50 caractères",
  "email": "L'email doit être valide"
}
```

**Authentification échouée (401):**
```json
{
  "timestamp": "2024-01-13T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Nom d'utilisateur ou mot de passe incorrect",
  "path": "/api/auth/login"
}
```

## 🔄 Workflow complet

1. **Inscription** → Recevez le token JWT
2. **Stockez le token** (localStorage, sessionStorage, cookie)
3. **Utilisez le token** dans l'en-tête Authorization pour les requêtes
4. **Rafraîchissez le token** avant expiration (optionnel)
5. **Déconnexion** → Supprimez le token côté client

## 📦 Dépendances utilisées

- Spring Boot 3.5.6
- Spring Security 6
- JJWT 0.12.3
- MySQL Connector
- Lombok
- Validation API

## 🎓 Bonnes pratiques

1. **Ne jamais** exposer le secret JWT
2. **Toujours** utiliser HTTPS en production
3. **Stocker** les tokens de manière sécurisée
4. **Implémenter** un système de refresh token pour les sessions longues
5. **Valider** toutes les entrées utilisateur
6. **Logger** les tentatives de connexion échouées
7. **Limiter** le nombre de tentatives de connexion (rate limiting)

## 🔧 Personnalisation

### Changer la durée de validité du token

Dans `application.properties`:
```properties
jwt.expiration=3600000  # 1 heure en millisecondes
```

### Ajouter des claims personnalisés au JWT

Dans `AuthService.java`:
```java
Map<String, Object> extraClaims = new HashMap<>();
extraClaims.put("role", user.getRole().name());
extraClaims.put("userId", user.getId());
String jwtToken = jwtService.generateToken(extraClaims, user);
```

## 📞 Support

Pour toute question ou problème, consultez la documentation Spring Security:
https://docs.spring.io/spring-security/reference/index.html
