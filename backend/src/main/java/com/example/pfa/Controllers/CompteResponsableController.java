package com.example.pfa.Controllers;

import com.example.pfa.entities.CompteEtudiantResponsable;
import com.example.pfa.entities.CompteResponsable;
import com.example.pfa.repositories.CompteEtudiantResponsableRepository;
import com.example.pfa.services.CompteResponsableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/compte-responsable")
public class CompteResponsableController {

    @Autowired
    private CompteResponsableService compteResponsableService;



    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody CompteResponsable compteResponsable) {
        if (compteResponsable instanceof CompteEtudiantResponsable compteEtudiantResponsable) {
            if (compteEtudiantResponsable.getFilière() == null || compteEtudiantResponsable.getFilière().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La filière est obligatoire pour un étudiant responsable");
            }
        }
        compteResponsableService.register(compteResponsable);
        return ResponseEntity.status(HttpStatus.CREATED).body("Responsable enregistré avec succès");
    }

    // Connexion d'un responsable
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        CompteResponsable responsable = compteResponsableService.authenticate(email, password);

        if (responsable != null) {
            // Générer un nouveau token
            String token = UUID.randomUUID().toString();

            // IMPORTANT: Stocker le token dans l'entité
            responsable.setResetToken(token);
            // Optionnel: définir une date d'expiration
            // responsable.setResetTokenExpiry(new Date(System.currentTimeMillis() + 86400000)); // 24h

            // Sauvegarder l'entité mise à jour
            compteResponsableService.save(responsable);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("responsable", responsable);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Identifiants incorrects");
        }
    }


    // Tableau de bord (accès après connexion)
    @GetMapping("/dashboard/{id}")
    public ResponseEntity<Object> showDashboard(@PathVariable("id") Long id) {
        Optional<CompteResponsable> responsableOptional = compteResponsableService.findById(id);

        if (responsableOptional.isPresent()) {
            return ResponseEntity.ok(responsableOptional.get());  // Retourne les détails du responsable
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Compte responsable introuvable");
        }
    }

    // Mise à jour des informations d'un responsable
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateCompteResponsable(@PathVariable("id") Long id,
                                                          @Valid @RequestBody CompteResponsable updatedCompteResponsable) {
        Optional<CompteResponsable> responsableOptional = compteResponsableService.findById(id);

        if (responsableOptional.isPresent()) {
            compteResponsableService.updateCompteResponsable(id, updatedCompteResponsable);
            return ResponseEntity.ok("Responsable mis à jour avec succès");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Compte responsable introuvable");
        }
    }

    // Supprimer un responsable
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCompteResponsable(@PathVariable("id") Long id) {
        Optional<CompteResponsable> responsableOptional = compteResponsableService.findById(id);

        if (responsableOptional.isPresent()) {
            compteResponsableService.deleteCompteResponsable(id);
            return ResponseEntity.ok("Responsable supprimé avec succès");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Compte responsable introuvable");
        }
    }

    //---------------------------- Concernant la partie password -----------------

    // Requête pour mot de passe oublié
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("L'email est requis");
        }

        // Vérifier si l'email existe
        if (!compteResponsableService.emailExists(email)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cet email n'est pas associé à un compte");
        }

        // Envoyer l'email de réinitialisation
        boolean emailSent = compteResponsableService.sendPasswordResetEmail(email);

        if (emailSent) {
            return ResponseEntity.ok("Un email de réinitialisation a été envoyé à votre adresse");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'envoi de l'email de réinitialisation");
        }
    }
/// //////////////////// MODIFIER PASSWORD ///////////////

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Le token et le nouveau mot de passe sont requis");
        }

        // 🔐 Encoder le nouveau mot de passe
        String encodedPassword = passwordEncoder.encode(newPassword);

        // 🔄 Passer le mot de passe encodé au service
        boolean resetSuccess = compteResponsableService.resetPassword(token, encodedPassword);

        if (resetSuccess) {
            return ResponseEntity.ok("Votre mot de passe a été réinitialisé avec succès");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Le lien de réinitialisation est invalide ou a expiré");
        }
    }




    /**
     * Récupère les informations du profil du responsable authentifié
     * @param authHeader L'en-tête d'autorisation contenant le token
     * @return Les informations du profil du responsable
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getResponsableProfile(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token d'authentification manquant ou invalide");
        }

        String token = authHeader.substring(7); // Enlever "Bearer "

        // Rechercher le responsable par son token
        Optional<CompteResponsable> responsableOptional = compteResponsableService.findByResetToken(token);

        if (responsableOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Session invalide ou expirée");
        }

        CompteResponsable responsable = responsableOptional.get();

        // Créer un objet avec seulement les informations nécessaires pour le frontend
        Map<String, Object> profileInfo = new HashMap<>();
        profileInfo.put("id", responsable.getId());
        profileInfo.put("nom", responsable.getNom_responsable());
        profileInfo.put("prenom", responsable.getPrenom_responsable());
        profileInfo.put("email", responsable.getEmail());

        // Ajouter des informations spécifiques selon le type de compte
        if (responsable instanceof CompteEtudiantResponsable) {
            CompteEtudiantResponsable etudiantResponsable = (CompteEtudiantResponsable) responsable;
            profileInfo.put("niveau", "Étudiant");
            profileInfo.put("filiere", etudiantResponsable.getFilière());
        } else {
            profileInfo.put("niveau", "Responsable");
        }

        return ResponseEntity.ok(profileInfo);
    }


}
