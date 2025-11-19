package projetitecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import projetitecommerce.dto.AuthResponse;
import projetitecommerce.dto.LoginRequest;
import projetitecommerce.dto.RegisterRequest;
import projetitecommerce.dto.UpdateProfileRequest;
import projetitecommerce.model.Role;
import projetitecommerce.model.User;
import projetitecommerce.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Créer l'utilisateur
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .enabled(true)
                .build();

        User savedUser = userService.createUser(user);

        // Générer le token JWT
        String jwtToken = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .message("Inscription réussie")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            // Authentifier l'utilisateur
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            // Récupérer l'utilisateur
            User user = (User) authentication.getPrincipal();

            // Générer le token JWT
            String jwtToken = jwtService.generateToken(user);

            return AuthResponse.builder()
                    .token(jwtToken)
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .message("Connexion réussie")
                    .build();
        } catch (AuthenticationException e) {
            throw new RuntimeException("Nom d'utilisateur ou mot de passe incorrect");
        }
    }

    public User updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Mettre à jour l'email si fourni et différent
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userService.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Cet email est déjà utilisé");
            }
            user.setEmail(request.getEmail());
        }

        // Mettre à jour le prénom si fourni
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        // Mettre à jour le nom si fourni
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        return userService.updateUser(userId, user);
    }
}
