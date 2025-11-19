package projetitecommerce.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Test", description = "Endpoints de test pour vérifier l'authentification")
@SecurityRequirement(name = "Bearer Authentication")
public class TestController {

    @GetMapping("/public")
    @Operation(summary = "Endpoint public (accessible sans authentification)")
    public String publicEndpoint() {
        return "Ceci est un endpoint public - accessible à tous";
    }

    @GetMapping("/user")
    @Operation(summary = "Endpoint utilisateur (nécessite authentification)")
    public String userEndpoint() {
        return "Ceci est un endpoint protégé - accessible aux utilisateurs authentifiés";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Endpoint admin (nécessite rôle ADMIN)")
    public String adminEndpoint() {
        return "Ceci est un endpoint admin - accessible uniquement aux administrateurs";
    }
}
