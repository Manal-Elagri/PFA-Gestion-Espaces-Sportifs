package com.example.pfa.Controllers;

import com.example.pfa.entities.Club;
import com.example.pfa.entities.CompteResponsable;
import com.example.pfa.services.ClubService;
import com.example.pfa.services.CompteResponsableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private CompteResponsableService compteResponsableService;

    // Afficher tous les clubs d’un responsable
    @GetMapping("/mes-clubs")
    public ResponseEntity<List<Club>> getMesClubs(Authentication auth) {
        CompteResponsable responsable = compteResponsableService.getResponsableByUsername(auth.getName());
        List<Club> clubs = clubService.getAllClubsByResponsable(responsable.getId());

        if (clubs.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(clubs);
    }


    // Créer un club
    @PostMapping("/responsable/{responsableId}/save")
    public ResponseEntity<Club> createClub(@PathVariable Long responsableId, @RequestBody Club club) {
        Club createdClub = clubService.createClub(responsableId, club);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClub);
    }

    // Modifier un club
    @PutMapping("/update/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id, @RequestBody Club updatedClub) {
        Club club = clubService.updateClub(id, updatedClub);
        if (club != null) {
            return ResponseEntity.ok(club);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Supprimer un club
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        Club club = clubService.getClubById(id);
        if (club != null) {
            clubService.deleteClub(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

     @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // Télécharger une image
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String uploadPath = Paths.get(uploadDir, "Club").toString();

            // Créer le répertoire s'il n'existe pas
            Files.createDirectories(Paths.get(uploadPath));

            // Générer un nom de fichier unique
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path path = Paths.get(uploadPath, uniqueFileName);

            // Copier le fichier
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Construire l'URL de l'image
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/Club/")
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
