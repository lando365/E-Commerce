package projetitecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

/**
 * Entité représentant une catégorie de produits (ex : Smartphones, Laptops).
 * Une catégorie peut contenir plusieurs produits.
 */
@Entity
@Table(name = "categories")
public class Category {

    /** Identifiant unique de la catégorie. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nom de la catégorie. */
    private String name;

    /** Liste des produits associés à cette catégorie. */
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Product> products;

    /** Constructeur vide requis par JPA. */
    public Category() {}

    // --- Getters et Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Product> getProducts() { return products; }
    public void setProducts(List<Product> products) { this.products = products; }
}
