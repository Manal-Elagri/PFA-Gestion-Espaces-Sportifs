package com.example.pfa.Controllers;

import com.example.pfa.entities.Club;
import com.example.pfa.entities.Competition;
import com.example.pfa.entities.ClubCompetition;
import com.example.pfa.entities.StatutParticipation;
import com.example.pfa.repositories.ClubCompetitionRepository;
import com.example.pfa.repositories.ClubRepository;
import com.example.pfa.repositories.CompétitionRepository;
import com.example.pfa.services.ParticipationCompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/competitions")
public class ParticipationCompetitionController {

    @Autowired
    private ParticipationCompetitionService participationCompetitionService;

    @Autowired
    private ClubCompetitionRepository clubCompetitionRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private CompétitionRepository  compétitionRepository ;


    @GetMapping("/participations/statistiques/{clubId}")
    public ResponseEntity<Map<String, Integer>> getStats(@PathVariable Long clubId) {
        int valides = clubCompetitionRepository.countByStatutParticipationAndClubId(StatutParticipation.VALIDE, clubId);
        int inscrits = clubCompetitionRepository.countByStatutParticipationAndClubId(StatutParticipation.INSCRIT, clubId);
        int elimines = clubCompetitionRepository.countByStatutParticipationAndClubId(StatutParticipation.ELIMINE, clubId);

        Map<String, Integer> stats = new HashMap<>();
        stats.put("valides", valides);
        stats.put("inscrits", inscrits);
        stats.put("elimines", elimines);

        return ResponseEntity.ok(stats);
    }



    @GetMapping("/api/participations")
    public List<ClubCompetition> getAllParticipations() {
        return clubCompetitionRepository.findAll(); // ou une méthode spécifique
    }


    // Rejoindre une compétition
    @PostMapping("/join/{clubId}/{competitionId}")
    public ResponseEntity<ClubCompetition> joinCompetition(@PathVariable Long clubId, @PathVariable Long competitionId) {
        try {
            Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club non trouvé"));
            Competition competition = compétitionRepository.findById(competitionId).orElseThrow(() -> new RuntimeException("Compétition non trouvée"));
            ClubCompetition participation = participationCompetitionService.joinCompetition(club, competition);
            return ResponseEntity.status(HttpStatus.CREATED).body(participation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Erreur si le club est déjà inscrit
        }
    }

    // Annuler une participation à une compétition (en supprimant si l'état est "INSCRIT")
    @DeleteMapping("/cancel/{clubId}/{competitionId}")
    public ResponseEntity<String> cancelParticipation(@PathVariable Long clubId, @PathVariable Long competitionId) {
        try {
            // Récupérer les objets Club et Competition via leurs IDs
            Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club non trouvé"));
            Competition competition = compétitionRepository.findById(competitionId).orElseThrow(() -> new RuntimeException("Compétition non trouvée"));

            // Appeler le service pour annuler la participation
            participationCompetitionService.cancelParticipation(club, competition);

            return ResponseEntity.ok("Participation annulée avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'annulation de la participation : " + e.getMessage());
        }
    }


    // Obtenir toutes les compétitions d'un club
    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<ClubCompetition>> getCompetitionsByClub(@PathVariable Long clubId) {
        // Créer un objet Club pour récupérer les compétitions via l'ID
        Club club = new Club();  // Logique pour récupérer le club avec l'ID
        club.setId(clubId);

        List<ClubCompetition> competitions = participationCompetitionService.getCompetitionsByClub(club);
        if (competitions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);  // Retourne 404 si aucune compétition n'est trouvée pour ce club
        }
        return ResponseEntity.ok(competitions);
    }
}
