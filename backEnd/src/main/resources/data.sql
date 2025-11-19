-- Insertion d'un utilisateur admin par défaut
-- Mot de passe: admin123 (encodé avec BCrypt)
-- Note: Ce fichier sera exécuté automatiquement au démarrage si spring.jpa.hibernate.ddl-auto=create

-- INSERT INTO users (username, email, password, first_name, last_name, role, enabled, created_at, updated_at)
-- VALUES ('admin', 'admin@ecommerce.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Admin', 'System', 'ADMIN', true, NOW(), NOW());

-- Pour créer un nouvel utilisateur admin, utilisez l'endpoint /api/auth/register
-- puis mettez à jour manuellement le rôle dans la base de données:
-- UPDATE users SET role = 'ADMIN' WHERE username = 'votre_username';
