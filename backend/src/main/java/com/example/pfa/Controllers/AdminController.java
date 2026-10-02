package com.example.pfa.Controllers;

import com.example.pfa.entities.*;
import com.example.pfa.repositories.AdminRepository;
import com.example.pfa.repositories.ClubCompetitionRepository;
import com.example.pfa.repositories.ResultatMatchsRepository;
import com.example.pfa.services.AdminService;
import com.example.pfa.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AdminRepository adminRepository ;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ResultatMatchsRepository resultatMatchsRepository;

    @Autowired
    private EmailService emailService;


    @Autowired
    private ClubCompetitionRepository clubCompetitionRepository;

    //----------------------------  Test D'Email -----------------------------

    @PostMapping("/test-email")
    public ResponseEntity<String> testEmail(@RequestParam String to) {
        try {
            emailService.sendSimpleMessage(to, "Test Email de SPORTENSAJ",
                    "Ceci est un test pour vérifier que le système d'envoi d'email fonctionne correctement.");
            return ResponseEntity.ok("Email envoyé avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }

    // ------------------- Authentification --------------------

    @PostMapping("/register")
    public Admin register(@RequestBody Admin admin) {
       return adminService.register(admin);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Admin admin = adminService.authenticate(email, password);
        if (admin != null) {
            // Exemple simple de "token" statique à remplacer par JWT plus tard
            String token = UUID.randomUUID().toString();

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("admin", admin);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Identifiants invalides");
        }
    }

    // ------------------- Gestion des compétitions --------------------

    @PostMapping("/competitions")
    public Competition createCompetition(@RequestBody Competition competition) {
        return adminService.createCompetition(competition);
    }

    @PutMapping("/competitions/{id}")
    public Competition updateCompetition(@PathVariable Long id, @RequestBody Competition competitionDetails) {
        return adminService.updateCompetition(id, competitionDetails);
    }

    @DeleteMapping("/competitions/{id}")
    public boolean deleteCompetition(@PathVariable Long id) {
        return adminService.deleteCompetition(id);
    }

    @GetMapping("/competitions")
    public List<Competition> getAllCompetitions() {
        return adminService.getAllCompetitions();
    }


    @GetMapping("/competitions/a-venir/json")
    public List<Competition> getCompetitionsAVenirJson() {
        return adminService.getCompetitionsAVenir();
    }

    //////////////// ------------------- Gestion des réservations --------------------///////////////////////

    @GetMapping("/reservations/en-attente")
    public List<ReservationTerrain> getReservationsEnAttente() {
        return adminService.getReservationsEnAttente();
    }

    @GetMapping("/reservations/validees")
    public List<ReservationTerrain> getReservationsValidees() {
        return adminService.getReservationsValidees();
    }

    @GetMapping("/reservations")
    public List<ReservationTerrain> getAllReservations() {
        return adminService.getAllReservations();
    }

    @GetMapping("/reservations/notifications/{heures}")
    public List<ReservationTerrain> getReservationsEnAttenteDepuis(@PathVariable Long heures) {
        return adminService.getReservationsEnAttenteDepuis(heures);
    }

    @PutMapping("/reservations/{id}/etat")
    public void changeEtatReservation(@PathVariable Long id, @RequestParam EtatReservationTerrain newstatus) {
        ReservationTerrain reservation = adminService.getReservationParId(id)
                .orElseThrow(() -> new RuntimeException("Reservation non trouvée"));
        adminService.changeEtatReservation(reservation, newstatus);
    }


    @GetMapping("/dashboard")
    public Map<String, Object> getTableauDeBord() {
        return adminService.getTableauDeBord();
    }



    @GetMapping("/reservations/equipe/{equipeId}")
    public List<ReservationTerrain> getReservationParEquipe(@PathVariable Long equipeId) {
        return adminService.getReservationParEquipe(equipeId);
    }

    // ------------------- Gestion des clubs --------------------

    @GetMapping("/clubs")
    public List<Club> getAllClubs() {
        return adminService.getAllClubs();
    }


    @GetMapping("/responsable/{id}/clubs")
    public List<Club> getClubsByResponsable(@PathVariable Long id) {
        return adminService.getAllClubsByResponsable(id);
    }
    // ------------------- Gestion des participations --------------------

    @GetMapping("/participations/club/{clubId}")
    public List<ClubCompetition> getParticipationsParClub(@PathVariable Long clubId) {
        return adminService.getParticipationsParClub(clubId);
    }

    @GetMapping("/participations/competition/{competitionId}")
    public List<ClubCompetition> getParticipationsParCompetition(@PathVariable Long competitionId) {
        return adminService.getParticipationsParCompetition(competitionId);
    }

    @GetMapping("/participations/stats")
    public Map<String, Object> getStatsParticipations() {
        return adminService.getTableauDeBordParticipations();
    }

    @PutMapping("/participations/{id}/status")
    public void changeParticipationStatus(@PathVariable Long id, @RequestParam StatutParticipation newStatus) {
        ClubCompetition participation = adminService.getParticipationById(id)
                .orElseThrow(() -> new RuntimeException("Participation non trouvée"));
        adminService.changeParticipationStatus(participation, newStatus);
    }


    @GetMapping("/all-participations")
    public List<ClubCompetition> getAllParticipations() {
        return clubCompetitionRepository.findAll();
    }
    // ------------------- Gestion des terrains --------------------

    @PostMapping("/terrains")
    public Terrain createTerrain(@RequestBody Terrain terrain) {
        return adminService.createTerrain(terrain);
    }

    @PutMapping("/terrains/{id}")
    public Terrain updateTerrain(@PathVariable Long id, @RequestBody Terrain terrainDetails) {
        return adminService.updateTerrain(id, terrainDetails);
    }

    @DeleteMapping("/terrains/{id}")
    public boolean deleteTerrain(@PathVariable Long id) {
        return adminService.deleteTerrain(id);
    }
    @GetMapping("/terrains")
    public List<Terrain> getAllTerrain() {
        return adminService.getAllTerrain();
    }

    // ------------------- Gestion des équipes --------------------

    @GetMapping("/responsable/{id}/equipes")
    public List<Equipe> getEquipesByResponsable(@PathVariable Long id) {
        return adminService.getAllEquipesByResponsable(id);
    }
    @GetMapping("/equipes")
    public List<Equipe> getAllEquipes() {
        return adminService.getAllEquipes();
    }

    // ------------------- Résultats de matchs --------------------

    @PostMapping("/resultats")
    public ResultatMatchs createResultatMatch(@RequestBody ResultatMatchs resultatMatch) {
        return adminService.createResultatMatch(resultatMatch);
    }

    @PutMapping("/resultats/{id}")
    public ResultatMatchs updateResultatMatch(@PathVariable Long id, @RequestBody ResultatMatchs details) {
        return adminService.updateResultatMatch(id, details);
    }

    @DeleteMapping("/resultats/{id}")
    public boolean deleteResultatMatch(@PathVariable Long id) {
        return adminService.deleteResultatMatch(id);
    }


    @GetMapping("/all-resultats")
    public List<ResultatMatchs> getAllResultatMatchs() {
        return resultatMatchsRepository.findAll();
    }
    // ------------------- Tables de score --------------------

    @PostMapping("/scores")
    public TableScore createScore(@RequestBody TableScore tableScore) {
        return adminService.createTableScore(tableScore);
    }

    @PutMapping("/scores/{id}")
    public TableScore updateScore(@PathVariable Long id, @RequestBody TableScore details) {
        return adminService.updateTableScore(id, details);
    }

    @DeleteMapping("/scores/{id}")
    public void deleteScore(@PathVariable Long id) {
        adminService.deleteTableScore(id);
    }

    @GetMapping("/scores/club/{clubId}")
    public TableScore getScoreForClub(@PathVariable Long clubId) {
        return adminService.getTableScoreForClub(clubId);
    }

    @GetMapping("/scores")
    public List<TableScore> getAllScores() {
        return adminService.getAllTablesScores();
    }

    // ... autres méthodes ...
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;


    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String uploadPath = Paths.get(uploadDir, "SPORTENSAJ").toString();

            // Créer le répertoire s'il n'existe pas
            Files.createDirectories(Paths.get(uploadPath));

            // Générer un nom de fichier unique
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path path = Paths.get(uploadPath, uniqueFileName);

            // Copier le fichier
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Construire l'URL de l'image
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/SPORTENSAJ/")
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
