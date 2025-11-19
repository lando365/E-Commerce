package projetitecommerce.web;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import projetitecommerce.repo.ProductRepository;
import projetitecommerce.repo.CategoryRepository;

/**
 * Contrôleur Spring MVC pour le catalogue public (interface web avec Thymeleaf).
 * Il permet d’afficher les produits filtrés par recherche ou par catégorie.
 */
@Controller
@RequiredArgsConstructor
public class CatalogController {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;

    /**
     * Affiche la page principale du catalogue.
     *
     * @param categoryId Identifiant optionnel d'une catégorie à filtrer.
     * @param search     Mot-clé de recherche optionnel.
     * @param model      Modèle de données pour Thymeleaf.
     * @return la vue du catalogue.
     */
    @GetMapping("/catalog")
    public String showCatalog(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            Model model) {

        // 🔍 Cas 1 : recherche par mot-clé
        if (search != null && !search.isBlank()) {
            model.addAttribute("products", productRepo.findByNameContainingIgnoreCaseOrBrandNameContainingIgnoreCase(search));
        }
        // 🏷️ Cas 2 : filtrage par catégorie
        else if (categoryId != null) {
            model.addAttribute("products", productRepo.findByCategoryId(categoryId));
        }
        // 📦 Cas 3 : afficher tout
        else {
            model.addAttribute("products", productRepo.findAllWithCategory());
        }

        // Ajouter les autres données nécessaires à la vue
        model.addAttribute("categories", categoryRepo.findAll());
        model.addAttribute("selectedCategoryId", categoryId);
        model.addAttribute("search", search);

        return "catalog/index";
    }
}