package com.example.pfa.Controllers;

import com.example.pfa.entities.Equipe;
import com.example.pfa.services.EquipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/equipes")
public class EquipeController {

    @Autowired
    private EquipeService equipeService;

    // Créer une équipe
    @PostMapping("/create/{responsableId}")
    public ResponseEntity<Equipe> createEquipe(@PathVariable Long responsableId, @RequestBody Equipe equipe) {
        try {
            Equipe createdEquipe = equipeService.createEquipe(responsableId, equipe);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEquipe);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Erreur 400 si responsable non trouvé
        }
    }

    // Modifier une équipe existante
    @PutMapping("/update/{equipeId}")
    public ResponseEntity<Equipe> updateEquipe(@PathVariable Long equipeId, @RequestBody Equipe equipeDetails) {
        try {
            Equipe updatedEquipe = equipeService.updateEquipe(equipeId, equipeDetails);
            return ResponseEntity.ok(updatedEquipe);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Erreur 404 si équipe non trouvée
        }
    }

    // Supprimer une équipe
    @DeleteMapping("/delete/{equipeId}")
    public ResponseEntity<String> deleteEquipe(@PathVariable Long equipeId) {
        try {
            equipeService.deleteEquipe(equipeId);
            return ResponseEntity.ok("Équipe supprimée avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Équipe non trouvée");  // Erreur 404 si équipe non trouvée
        }
    }

    // Afficher toutes les équipes d'un responsable
    @GetMapping("/responsable/{responsableId}")
    public ResponseEntity<List<Equipe>> getAllEquipesByResponsable(@PathVariable Long responsableId) {
        List<Equipe> equipes = equipeService.getAllEquipeByResponsable(responsableId);
        if (equipes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);  // Retourne 404 si aucune équipe n'est trouvée pour le responsable
        }
        return ResponseEntity.ok(equipes);
    }

    // Trouver une équipe par son ID
    @GetMapping("/{equipeId}")
    public ResponseEntity<Equipe> getEquipeById(@PathVariable Long equipeId) {
        try {
            Equipe equipe = equipeService.getEquipeById(equipeId);
            return ResponseEntity.ok(equipe);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Erreur 404 si équipe non trouvée
        }
    }

    // ... autres méthodes ...
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;


    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String uploadPath = Paths.get(uploadDir, "Equipe").toString();

            // Créer le répertoire s'il n'existe pas
            Files.createDirectories(Paths.get(uploadPath));

            // Générer un nom de fichier unique
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path path = Paths.get(uploadPath, uniqueFileName);

            // Copier le fichier
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Construire l'URL de l'image
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/Equipe/")
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
