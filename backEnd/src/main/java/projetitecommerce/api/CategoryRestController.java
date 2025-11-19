package projetitecommerce.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projetitecommerce.model.Category;
import projetitecommerce.repo.CategoryRepository;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des catégories.
 * Permet de récupérer la liste complète des catégories.
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryRestController {

    private final CategoryRepository categoryRepository;

    /**
     * Injection du repository de catégorie.
     *
     * @param categoryRepository repository de la table Category.
     */
    public CategoryRestController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Récupère la liste complète des catégories disponibles.
     *
     * @return liste de {@link Category}.
     */
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Récupère une catégorie par son ID.
     *
     * @param id identifiant de la catégorie.
     * @return la catégorie trouvée ou 404 si non trouvée.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crée une nouvelle catégorie.
     *
     * @param category catégorie reçue depuis le frontend.
     * @return la catégorie créée.
     */
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    /**
     * Met à jour une catégorie existante.
     *
     * @param id identifiant de la catégorie à modifier.
     * @param updatedCategory nouvelles données de la catégorie.
     * @return catégorie mise à jour ou 404 si non trouvée.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(updatedCategory.getName());
                    return ResponseEntity.ok(categoryRepository.save(category));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Supprime une catégorie.
     *
     * @param id identifiant de la catégorie à supprimer.
     * @return code 204 si supprimée, 404 si non trouvée.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}