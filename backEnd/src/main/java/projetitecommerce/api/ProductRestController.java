package projetitecommerce.api;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import projetitecommerce.model.Product;
import projetitecommerce.repo.ProductRepository;
import projetitecommerce.repo.CategoryRepository;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Contrôleur REST gérant les opérations CRUD sur les produits.
 * Accessible depuis le frontend Angular via http://localhost:8080/api/products
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductRestController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Injection des repositories via constructeur.
     */
    public ProductRestController(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * Récupère la liste de tous les produits.
     *
     * @return liste complète des produits.
     */
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * Récupère un produit par son ID.
     *
     * @param id identifiant du produit.
     * @return le produit trouvé ou 404 si non trouvé.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crée un nouveau produit.
     *
     * @param product produit reçu depuis le frontend.
     * @param bindingResult résultat de la validation.
     * @return le produit créé ou une erreur 400 si les validations échouent.
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errors);
        }
        
        if (product.getCategory() == null || product.getCategory().getId() == null) {
            return ResponseEntity.badRequest().body(List.of("La catégorie est obligatoire"));
        }
        
        return ResponseEntity.ok(productRepository.save(product));
    }

    /**
     * Met à jour un produit existant.
     *
     * @param id identifiant du produit à modifier.
     * @param updatedProduct nouvelles données du produit.
     * @param bindingResult résultat de la validation.
     * @return produit mis à jour ou 404 si non trouvé.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product updatedProduct, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errors);
        }
        
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setBrandName(updatedProduct.getBrandName());
                    product.setPrice(updatedProduct.getPrice());
                    product.setImageUrl(updatedProduct.getImageUrl());
                    product.setCategory(updatedProduct.getCategory());
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Supprime un produit.
     *
     * @param id identifiant du produit à supprimer.
     * @return code 204 si supprimé, 404 si non trouvé.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
