package com.example.pfa.Controllers;
import com.example.pfa.entities.CompteResponsable;
import com.example.pfa.entities.DemandeCreation;
import com.example.pfa.services.CompteResponsableService;
import com.example.pfa.services.DemandeCreationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/demandes")
public class DemandeCreationController {
    @Autowired
    private DemandeCreationService demandeService;

    @Autowired
    private CompteResponsableService responsableService;

    /**
     * Créer une demande pour un nouveau club
     */
    @PostMapping("/club")
    public ResponseEntity<?> creerDemandeClub(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            // Récupérer l'utilisateur connecté par son email
            CompteResponsable responsable = responsableService.getResponsableByUsername(auth.getName());

            // Extraire les données du club
            String nom = (String) request.get("nom");
            String etablissement = (String) request.get("etablissement");
            String imageURL = (String) request.get("imageURL");

            // Créer la demande
            DemandeCreation demande = demandeService.creerDemandeClub(nom, etablissement, imageURL, responsable);

            return ResponseEntity.status(HttpStatus.CREATED).body(demande);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Créer une demande pour une nouvelle équipe
     */
    @PostMapping("/equipe")
    public ResponseEntity<?> creerDemandeEquipe(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            // Récupérer l'utilisateur connecté par son email
            CompteResponsable responsable = responsableService.getResponsableByUsername(auth.getName());

            // Extraire les données de l'équipe
            String nom = (String) request.get("nom");
            Integer nbrJoueurs = (Integer) request.get("nbrJoueurs");
            String imageURL = (String) request.get("imageURL");

            // Créer la demande
            DemandeCreation demande = demandeService.creerDemandeEquipe(nom, nbrJoueurs, imageURL, responsable);

            return ResponseEntity.status(HttpStatus.CREATED).body(demande);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Liste des demandes en attente (accessible uniquement par les administrateurs)
     */
    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DemandeCreation>> getDemandesEnAttente() {
        List<DemandeCreation> demandes = demandeService.getDemandesEnAttente();
        return ResponseEntity.ok(demandes);
    }

    /**
     * Liste des demandes d'un responsable
     */
    @GetMapping("/mes-demandes")
    public ResponseEntity<List<DemandeCreation>> getMesDemandes(Authentication auth) {
        CompteResponsable responsable = responsableService.getResponsableByUsername(auth.getName());
        List<DemandeCreation> demandes = demandeService.getDemandesByResponsable(responsable.getId());
        return ResponseEntity.ok(demandes);
    }

    /**
     * Obtenir les détails d'une demande
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDemandeById(@PathVariable Long id, Authentication auth) {
        Optional<DemandeCreation> optDemande = demandeService.getDemandeById(id);

        if (!optDemande.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        DemandeCreation demande = optDemande.get();

        // Vérifier que l'utilisateur est soit l'administrateur soit le responsable de la demande
        CompteResponsable responsable = responsableService.getResponsableByUsername(auth.getName());
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isOwner = demande.getResponsable().getId().equals(responsable.getId());

        if (isAdmin || isOwner) {
            return ResponseEntity.ok(demande);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès refusé");
        }
    }

    /**
     * Approuver une demande (admin seulement)
     */
    @PutMapping("/{id}/approuver")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approuverDemande(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String commentaire = request.get("commentaire");
            DemandeCreation demande = demandeService.approuverDemande(id, commentaire);
            return ResponseEntity.ok(demande);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Refuser une demande (admin seulement)
     */
    @PutMapping("/{id}/refuser")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> refuserDemande(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String commentaire = request.get("commentaire");
            DemandeCreation demande = demandeService.refuserDemande(id, commentaire);
            return ResponseEntity.ok(demande);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    // ... autres méthodes ...
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;


    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String uploadPath = Paths.get(uploadDir, "ClubENSAJ").toString();

            // Créer le répertoire s'il n'existe pas
            Files.createDirectories(Paths.get(uploadPath));

            // Générer un nom de fichier unique
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path path = Paths.get(uploadPath, uniqueFileName);

            // Copier le fichier
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Construire l'URL de l'image
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/ClubENSAJ/")
                    .path(uniqueFileName)
                    .toUriString();

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



}