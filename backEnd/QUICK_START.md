# 🚀 Guide de Démarrage Rapide - Authentification

## ✅ Implémentation Complète

Votre système d'authentification est maintenant **100% fonctionnel** avec :

- ✅ Spring Security 6
- ✅ JWT (JSON Web Tokens)
- ✅ Gestion des rôles (USER, ADMIN)
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ Documentation Swagger
- ✅ CORS configuré

## 📦 Fichiers Créés

### Modèles
- `model/User.java` - Entité utilisateur avec UserDetails
- `model/Role.java` - Énumération des rôles

### Sécurité
- `security/JwtService.java` - Service de gestion JWT
- `security/JwtAuthenticationFilter.java` - Filtre d'authentification

### Configuration
- `config/SecurityConfig.java` - Configuration Spring Security
- `config/OpenApiConfig.java` - Configuration Swagger
- `config/DataInitializer.java` - Initialisation des données

### Services
- `service/UserService.java` - Service utilisateur
- `service/AuthService.java` - Service d'authentification

### Repositories
- `repo/UserRepository.java` - Repository JPA

### DTOs
- `dto/LoginRequest.java` - DTO de connexion
- `dto/RegisterRequest.java` - DTO d'inscription
- `dto/AuthResponse.java` - DTO de réponse
- `dto/ErrorResponse.java` - DTO d'erreur

### Contrôleurs
- `api/AuthController.java` - Contrôleur d'authentification
- `api/TestController.java` - Contrôleur de test

### Exceptions
- `exception/GlobalExceptionHandler.java` - Gestionnaire global d'exceptions

## 🔧 Configuration

### 1. Dépendances ajoutées au pom.xml
```xml
- spring-boot-starter-security
- jjwt-api (0.12.3)
- jjwt-impl (0.12.3)
- jjwt-jackson (0.12.3)
- spring-security-test
```

### 2. application.properties
```properties
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
```

## 🎯 Démarrage

### 1. Installer les dépendances Maven
```bash
mvn clean install
```

### 2. Démarrer l'application
```bash
mvn spring-boot:run
```

### 3. Vérifier le démarrage
L'application créera automatiquement 2 utilisateurs :

**Admin:**
- Username: `admin`
- Password: `admin123`
- Role: `ADMIN`

**User:**
- Username: `user`
- Password: `user123`
- Role: `USER`

## 🧪 Tester l'API

### Option 1: Swagger UI (Recommandé)
1. Ouvrez: http://localhost:8080/swagger-ui.html
2. Testez `/api/auth/login` avec admin/admin123
3. Copiez le token reçu
4. Cliquez sur "Authorize" et entrez: `Bearer VOTRE_TOKEN`
5. Testez les autres endpoints

### Option 2: Fichier HTTP
Utilisez le fichier `TEST_AUTHENTICATION.http` avec VS Code REST Client

### Option 3: cURL

**Connexion:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Inscription:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"newuser",
    "email":"new@example.com",
    "password":"password123",
    "firstName":"New",
    "lastName":"User"
  }'
```

**Profil (avec token):**
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## 📚 Endpoints Disponibles

### Publics (sans authentification)
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/test/public` - Test public

### Protégés (avec token JWT)
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion
- `GET /api/test/user` - Test utilisateur

### Admin uniquement
- `GET /api/test/admin` - Test admin
- `GET /api/admin/**` - Tous les endpoints admin

## 🔐 Utilisation du JWT

### 1. Obtenir un token
Connectez-vous via `/api/auth/login` ou inscrivez-vous via `/api/auth/register`

### 2. Utiliser le token
Ajoutez l'en-tête à chaque requête:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Durée de validité
Le token est valide pendant **24 heures** (configurable dans application.properties)

## 🛡️ Sécurité

### Points importants

1. **Secret JWT**: Changez la clé secrète en production
2. **HTTPS**: Utilisez HTTPS en production
3. **Mot de passe admin**: Changez le mot de passe par défaut
4. **CORS**: Ajustez les origines autorisées selon vos besoins

### Modifier le secret JWT

Générez une nouvelle clé sécurisée:
```java
String secret = Encoders.BASE64.encode(
    Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded()
);
```

Ou utilisez un générateur en ligne (256 bits minimum)

## 📊 Structure de la Base de Données

### Table `users`
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔄 Workflow d'Authentification

```
1. Client → POST /api/auth/login
2. Server → Valide credentials
3. Server → Génère JWT token
4. Server → Retourne token + infos user
5. Client → Stocke le token
6. Client → Envoie token dans Authorization header
7. Server → Valide token
8. Server → Autorise l'accès
```

## 🐛 Dépannage

### Erreur 401 Unauthorized
- Vérifiez que le token est valide
- Vérifiez le format: `Bearer TOKEN`
- Vérifiez que le token n'a pas expiré

### Erreur 403 Forbidden
- Vérifiez que l'utilisateur a le bon rôle
- Les endpoints `/api/admin/**` nécessitent le rôle ADMIN

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré sur le port 3308
- Vérifiez les credentials dans application.properties

### Token invalide
- Le secret JWT doit être le même entre les redémarrages
- Utilisez une clé d'au moins 256 bits

## 📖 Documentation Complète

Consultez `AUTHENTICATION_README.md` pour la documentation détaillée incluant:
- Exemples de code JavaScript
- Gestion des erreurs
- Bonnes pratiques
- Personnalisation avancée

## 🎓 Prochaines Étapes

1. **Refresh Tokens**: Implémenter un système de refresh token
2. **Rate Limiting**: Limiter les tentatives de connexion
3. **Email Verification**: Vérification par email
4. **Password Reset**: Réinitialisation de mot de passe
5. **OAuth2**: Connexion via Google, Facebook, etc.
6. **Two-Factor Auth**: Authentification à deux facteurs

## ✨ Fonctionnalités Bonus Implémentées

- ✅ Utilisateurs de test créés automatiquement
- ✅ Validation complète des données
- ✅ Gestion globale des erreurs
- ✅ Documentation Swagger interactive
- ✅ Support CORS pour Angular/React
- ✅ Logs informatifs au démarrage
- ✅ Endpoints de test pour validation

## 💡 Conseils

1. **Développement**: Utilisez Swagger UI pour tester rapidement
2. **Production**: Activez HTTPS et changez tous les secrets
3. **Frontend**: Stockez le token dans localStorage ou httpOnly cookie
4. **Sécurité**: Implémentez un système de refresh token
5. **Monitoring**: Loggez les tentatives de connexion échouées

---

**🎉 Votre système d'authentification est prêt à l'emploi !**

Pour toute question, consultez la documentation Spring Security:
https://docs.spring.io/spring-security/reference/index.html
