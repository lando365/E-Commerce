package projetitecommerce.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import projetitecommerce.model.Product;
import projetitecommerce.repo.CategoryRepository;
import projetitecommerce.repo.ProductRepository;

@Controller
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {
    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("products", productRepo.findAll());
        return "products/list";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("product", new Product());
        model.addAttribute("categories", categoryRepo.findAll());
        return "products/form";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute("product") Product product,
                         BindingResult br, RedirectAttributes ra, Model model) {
        if (br.hasErrors()) {
            model.addAttribute("categories", categoryRepo.findAll());
            return "products/form";
        }
        productRepo.save(product);
        ra.addFlashAttribute("msg", "Produit créé !");
        return "redirect:/products";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("product", productRepo.findById(id).orElseThrow());
        model.addAttribute("categories", categoryRepo.findAll());
        return "products/form";
    }

    @PostMapping("/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("product") Product product,
                         BindingResult br, RedirectAttributes ra, Model model) {
        if (br.hasErrors()) {
            model.addAttribute("categories", categoryRepo.findAll());
            return "products/form";
        }
        product.setId(id);
        productRepo.save(product);
        ra.addFlashAttribute("msg", "Produit mis à jour !");
        return "redirect:/products";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        productRepo.deleteById(id);
        ra.addFlashAttribute("msg", "Produit supprimé.");
        return "redirect:/products";
    }
}
