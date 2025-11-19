package projetitecommerce.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import projetitecommerce.model.Category;
import projetitecommerce.model.Product;
import projetitecommerce.repo.CategoryRepository;
import projetitecommerce.repo.ProductRepository;

/**
 * Classe de préchargement de données à l'initialisation du projet.
 * Utilise CommandLineRunner pour exécuter le code au démarrage de l’application.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    /**
     * Injection des repositories.
     */
    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    /**
     * Méthode exécutée automatiquement au démarrage de l'application.
     * Elle crée des catégories et des produits par défaut si la base est vide.
     */
    @Override
    public void run(String... args) {
        // Étape 1 : Créer les catégories par défaut
        if (categoryRepository.count() == 0) {
            Category tshirtHomme = new Category();
            tshirtHomme.setName("T-shirts Homme");
            categoryRepository.save(tshirtHomme);

            Category tshirtFemme = new Category();
            tshirtFemme.setName("T-shirts Femme");
            categoryRepository.save(tshirtFemme);

            Category tshirtEnfant = new Category();
            tshirtEnfant.setName("T-shirts Enfant");
            categoryRepository.save(tshirtEnfant);

            System.out.println("✅ Catégories créées avec succès !");
        }

        // Étape 2 : Créer les produits par défaut
        if (productRepository.count() == 0) {
            Category tshirtHomme = categoryRepository.findByName("T-shirts Homme").orElseThrow();
            Category tshirtFemme = categoryRepository.findByName("T-shirts Femme").orElseThrow();
            Category tshirtEnfant = categoryRepository.findByName("T-shirts Enfant").orElseThrow();

            // T-shirts Homme
            Product tshirtHommeBasic = new Product();
            tshirtHommeBasic.setName("T-shirt Homme Basique");
            tshirtHommeBasic.setBrandName("Nike");
            tshirtHommeBasic.setPrice(19.99);
            tshirtHommeBasic.setImageUrl("https://picsum.photos/id/91/600/400");
            tshirtHommeBasic.setCategory(tshirtHomme);
            productRepository.save(tshirtHommeBasic);

            Product tshirtHommeMancheLongue = new Product();
            tshirtHommeMancheLongue.setName("T-shirt Homme Manche Longue");
            tshirtHommeMancheLongue.setBrandName("Adidas");
            tshirtHommeMancheLongue.setPrice(29.99);
            tshirtHommeMancheLongue.setImageUrl("https://picsum.photos/id/342/600/400");
            tshirtHommeMancheLongue.setCategory(tshirtHomme);
            productRepository.save(tshirtHommeMancheLongue);

            Product tshirtHommeSport = new Product();
            tshirtHommeSport.setName("T-shirt Homme Sport");
            tshirtHommeSport.setBrandName("Puma");
            tshirtHommeSport.setPrice(24.99);
            tshirtHommeSport.setImageUrl("https://picsum.photos/id/431/600/400");
            tshirtHommeSport.setCategory(tshirtHomme);
            productRepository.save(tshirtHommeSport);

            // T-shirts Femme
            Product tshirtFemmeBasic = new Product();
            tshirtFemmeBasic.setName("T-shirt Femme Basique");
            tshirtFemmeBasic.setBrandName("H&M");
            tshirtFemmeBasic.setPrice(15.99);
            tshirtFemmeBasic.setImageUrl("https://picsum.photos/id/64/600/400");
            tshirtFemmeBasic.setCategory(tshirtFemme);
            productRepository.save(tshirtFemmeBasic);

            Product tshirtFemmeOversize = new Product();
            tshirtFemmeOversize.setName("T-shirt Femme Oversize");
            tshirtFemmeOversize.setBrandName("Zara");
            tshirtFemmeOversize.setPrice(22.99);
            tshirtFemmeOversize.setImageUrl("https://picsum.photos/id/177/600/400");
            tshirtFemmeOversize.setCategory(tshirtFemme);
            productRepository.save(tshirtFemmeOversize);

            Product tshirtFemmeCrop = new Product();
            tshirtFemmeCrop.setName("T-shirt Femme Crop Top");
            tshirtFemmeCrop.setBrandName("Pull&Bear");
            tshirtFemmeCrop.setPrice(18.99);
            tshirtFemmeCrop.setImageUrl("https://picsum.photos/id/203/600/400");
            tshirtFemmeCrop.setCategory(tshirtFemme);
            productRepository.save(tshirtFemmeCrop);

            // T-shirts Enfant
            Product tshirtEnfantBasic = new Product();
            tshirtEnfantBasic.setName("T-shirt Enfant Basique");
            tshirtEnfantBasic.setBrandName("Kiabi");
            tshirtEnfantBasic.setPrice(9.99);
            tshirtEnfantBasic.setImageUrl("https://picsum.photos/id/433/600/400");
            tshirtEnfantBasic.setCategory(tshirtEnfant);
            productRepository.save(tshirtEnfantBasic);

            Product tshirtEnfantImprime = new Product();
            tshirtEnfantImprime.setName("T-shirt Enfant Imprimé");
            tshirtEnfantImprime.setBrandName("Disney");
            tshirtEnfantImprime.setPrice(14.99);
            tshirtEnfantImprime.setImageUrl("https://picsum.photos/id/453/600/400");
            tshirtEnfantImprime.setCategory(tshirtEnfant);
            productRepository.save(tshirtEnfantImprime);

            System.out.println("✅ Produits créés avec succès !");
        }
    }
}
