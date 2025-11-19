package projetitecommerce.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import projetitecommerce.model.Product;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour la gestion des produits.
 * Fournit des méthodes CRUD et des requêtes personnalisées.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {

    /** Récupère tous les produits avec leur catégorie. */
    @Query("SELECT p FROM Product p JOIN FETCH p.category")
    List<Product> findAllWithCategory();

    /** Récupère un produit par ID avec sa catégorie. */
    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.id = :id")
    Optional<Product> findByIdWithCategory(@Param("id") Long id);

    /** Récupère les produits d’une catégorie spécifique. */
    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.category.id = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);

    /** Recherche de produits par nom ou marque. */
    @Query("SELECT p FROM Product p JOIN FETCH p.category " +
            "WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.brandName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> findByNameContainingIgnoreCaseOrBrandNameContainingIgnoreCase(@Param("keyword") String keyword);
}