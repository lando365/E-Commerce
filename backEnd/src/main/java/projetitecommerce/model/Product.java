package projetitecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Entité représentant un produit dans le catalogue e-commerce.
 * Chaque produit est associé à une catégorie (ex : Smartphone, Laptop).
 */
@Entity
@Table(name = "products")
public class Product {

    /** Identifiant unique du produit. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nom du produit. */
    @NotBlank(message = "Le nom du produit est obligatoire")
    @Size(min = 2, max = 255, message = "Le nom doit contenir entre 2 et 255 caractères")
    private String name;

    /** Nom de la marque du produit. */
    @NotBlank(message = "La marque est obligatoire")
    @Size(min = 2, max = 255, message = "La marque doit contenir entre 2 et 255 caractères")
    private String brandName;

    /** Prix du produit. */
    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix doit être supérieur à 0")
    private double price;

    /** URL de l'image du produit. */
    @NotBlank(message = "L'URL de l'image est obligatoire")
    @Size(max = 500, message = "L'URL ne peut pas dépasser 500 caractères")
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    /** Catégorie à laquelle appartient le produit. */
    @NotNull(message = "La catégorie est obligatoire")
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    /** Constructeur vide requis par JPA. */
    public Product() {}

    // --- Getters et Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}