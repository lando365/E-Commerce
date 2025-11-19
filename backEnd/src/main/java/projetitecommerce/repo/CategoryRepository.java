package projetitecommerce.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import projetitecommerce.model.Category;
import java.util.Optional;

/**
 * Repository JPA pour l'entité {@link Category}.
 * Fournit des opérations CRUD automatiques et des méthodes personnalisées.
 */
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Recherche une catégorie par son nom.
     *
     * @param name nom de la catégorie à rechercher.
     * @return une instance de {@link Category} si elle existe.
     */
    Optional<Category> findByName(String name);
}
