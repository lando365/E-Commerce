package projetitecommerce.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import projetitecommerce.model.Role;
import projetitecommerce.model.User;
import projetitecommerce.service.UserService;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;

    @Override
    public void run(String... args) {
        // Créer un utilisateur admin par défaut si aucun admin n'existe
        if (!userService.existsByUsername("admin")) {
            try {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@ecommerce.com")
                        .password("admin123")
                        .firstName("Admin")
                        .lastName("System")
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();

                userService.createUser(admin);
                log.info("✅ Utilisateur admin créé avec succès");
                log.info("   Username: admin");
                log.info("   Password: admin123");
                log.info("   ⚠️  CHANGEZ CE MOT DE PASSE EN PRODUCTION !");
            } catch (Exception e) {
                log.error("❌ Erreur lors de la création de l'utilisateur admin: {}", e.getMessage());
            }
        } else {
            log.info("ℹ️  L'utilisateur admin existe déjà");
        }

        // Créer un utilisateur de test
        if (!userService.existsByUsername("user")) {
            try {
                User user = User.builder()
                        .username("user")
                        .email("user@ecommerce.com")
                        .password("user123")
                        .firstName("Test")
                        .lastName("User")
                        .role(Role.USER)
                        .enabled(true)
                        .build();

                userService.createUser(user);
                log.info("✅ Utilisateur de test créé avec succès");
                log.info("   Username: user");
                log.info("   Password: user123");
            } catch (Exception e) {
                log.error("❌ Erreur lors de la création de l'utilisateur de test: {}", e.getMessage());
            }
        }
    }
}
