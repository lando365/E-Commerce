package projetitecommerce.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import projetitecommerce.model.Category;
import projetitecommerce.repo.CategoryRepository;

@Controller
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryRepository categoryRepo;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("categories", categoryRepo.findAll());
        return "categories/list";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("category", new Category());
        return "categories/form";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute("category") Category category,
                         BindingResult br, RedirectAttributes ra) {
        if (br.hasErrors()) return "categories/form";
        categoryRepo.save(category);
        ra.addFlashAttribute("msg", "Catégorie créée !");
        return "redirect:/categories";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("category", categoryRepo.findById(id).orElseThrow());
        return "categories/form";
    }

    @PostMapping("/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("category") Category category,
                         BindingResult br, RedirectAttributes ra) {
        if (br.hasErrors()) return "categories/form";
        category.setId(id);
        categoryRepo.save(category);
        ra.addFlashAttribute("msg", "Catégorie mise à jour !");
        return "redirect:/categories";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        categoryRepo.deleteById(id);
        ra.addFlashAttribute("msg", "Catégorie supprimée.");
        return "redirect:/categories";
    }
}
