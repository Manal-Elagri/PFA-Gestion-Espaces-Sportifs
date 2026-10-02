package com.example.pfa.Controllers;

import com.example.pfa.entities.*;
import com.example.pfa.repositories.EquipeRepository;
import com.example.pfa.repositories.ReservationTerrainRepository;
import com.example.pfa.repositories.TerrainRepository;
import com.example.pfa.services.CompteResponsableService;
import com.example.pfa.services.EquipeService;
import com.example.pfa.services.ReservationTerrainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationTerrainController {

    @Autowired
    private ReservationTerrainService reservationTerrainService;

    @Autowired
    private CompteResponsableService responsableService;

    @Autowired
    private EquipeService equipeService;

    @Autowired
    private EquipeRepository equipeRepository;

    @Autowired
    private TerrainRepository terrainRepository;


    @Autowired
    private ReservationTerrainRepository    reservationTerrainRepository ;

    // Méthodes existantes modifiées pour inclure la date du calendrier
    @PostMapping("/passer/{equipeId}/{terrainId}")
    public ResponseEntity<ReservationTerrain> passerReservation(
            @PathVariable Long equipeId,
            @PathVariable Long terrainId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateCalendrier) {
        try {
            Equipe equipe = equipeRepository.findById(equipeId)
                    .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));
            Terrain terrain = terrainRepository.findById(terrainId)
                    .orElseThrow(() -> new RuntimeException("Terrain non trouvé"));

            ReservationTerrain reservation = reservationTerrainService.passerReservation(equipe, terrain, dateCalendrier);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/cancel/{reservationId}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long reservationId) {
        try {
            ReservationTerrain reservation = reservationTerrainRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

            reservationTerrainService.deleteReservationById(reservationId);
            return ResponseEntity.ok("Réservation annulée avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'annulation de la réservation : " + e.getMessage());
        }
    }

    @GetMapping("/mes-equipes")
    public ResponseEntity<List<Equipe>> getMesEquipes(Authentication auth) {
        CompteResponsable responsable = responsableService.getResponsableByUsername(auth.getName());
        List<Equipe> equipes = equipeService.getAllEquipeByResponsable(responsable.getId());
        if (equipes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(equipes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationTerrain> getReservationById(@PathVariable Long id) {
        try {
            ReservationTerrain reservation = reservationTerrainService.getReservationById(id);
            return ResponseEntity.ok(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<ReservationTerrain>> getAllReservations() {
        try {
            List<ReservationTerrain> reservations = reservationTerrainService.getAllReservations();
            return ResponseEntity.ok(reservations);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Terrain>> getTerrainsDisponibles() {
        List<Terrain> terrains = terrainRepository.findByEstDisponible(true);
        return ResponseEntity.ok(terrains);
    }

    // Nouvelles méthodes pour le calendrier

    @GetMapping("/validees")
    public ResponseEntity<List<ReservationTerrain>> getReservationsValides() {
        List<ReservationTerrain> reservations = reservationTerrainService.getReservationsValidees();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/validees/mois/{annee}/{mois}")
    public ResponseEntity<List<ReservationTerrain>> getReservationsValideesParMois(
            @PathVariable int annee, @PathVariable int mois) {
        List<ReservationTerrain> reservations = reservationTerrainService.getReservationsValideesParMois(annee, mois);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/reservations/terrain/{terrainId}/validees")
    public ResponseEntity<List<ReservationTerrain>> getReservationsValideesParTerrain(@PathVariable Long terrainId) {
        try {
            List<ReservationTerrain> reservations = reservationTerrainService.findByTerrainIdAndEtatReservation(
                    terrainId,
                    EtatReservationTerrain.VALIDEE
            );
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/validees/terrain/{terrainId}/mois/{annee}/{mois}")
    public ResponseEntity<List<ReservationTerrain>> getReservationsValideesParTerrainEtMois(
            @PathVariable Long terrainId, @PathVariable int annee, @PathVariable int mois) {
        List<ReservationTerrain> reservations =
                reservationTerrainService.getReservationsValideesParTerrainEtMois(terrainId, annee, mois);
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/jours-occupes")
    public ResponseEntity<Map<Long, List<LocalDate>>> getJoursOccupesParTerrain() {
        Map<Long, List<LocalDate>> joursOccupes = reservationTerrainService.getJoursOccupesParTerrain();
        return ResponseEntity.ok(joursOccupes);
    }

    @GetMapping("/terrain/{terrainId}/disponible")
    public ResponseEntity<Map<String, Object>> isTerrainDisponible(
            @PathVariable Long terrainId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        boolean disponible = reservationTerrainService.isTerrainDisponible(terrainId, date);

        Map<String, Object> response = new HashMap<>();
        response.put("terrainId", terrainId);
        response.put("date", date);
        response.put("disponible", disponible);

        return ResponseEntity.ok(response);
    }


   /* @Autowired
    private ReservationTerrainService reservationTerrainService;

    @Autowired
    private CompteResponsableService   responsableService;

    @Autowired
    private EquipeService  equipeService;

    @Autowired
    private EquipeRepository equipeRepository;

    @Autowired
    private TerrainRepository terrainRepository;

    // Créer une nouvelle réservation
    @PostMapping("/passer/{equipeId}/{terrainId}")
    public ResponseEntity<ReservationTerrain> passerReservation(@PathVariable Long equipeId, @PathVariable Long terrainId) {
        try {
            Equipe equipe = equipeRepository.findById(equipeId).orElseThrow(() -> new RuntimeException("Club non trouvé"));
            Terrain terrain = terrainRepository.findById(terrainId).orElseThrow(() -> new RuntimeException("Compétition non trouvée"));
            ReservationTerrain reservation = reservationTerrainService.passerReservation(equipe, terrain);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Erreur si l'equipe est déjà passer la reservation
        }
    }

    // Annuler une participation à une compétition (en supprimant si l'état est "INSCRIT")
    @DeleteMapping("/cancel/{equipeId}/{terrainId}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long equipeId, @PathVariable Long terrainId) {
        try {
            // Récupérer les objets Club et Competition via leurs IDs
            Equipe equipe = equipeRepository.findById(equipeId).orElseThrow(() -> new RuntimeException("Equipe non trouvé"));
            Terrain terrain = terrainRepository.findById(terrainId).orElseThrow(() -> new RuntimeException("Terrain non trouvée"));

            // Appeler le service pour annuler la participation
            reservationTerrainService.deleteReservation(equipe, terrain);

            return ResponseEntity.ok("Reservation annulée avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'annulation de la reservation  : " + e.getMessage());
        }
    }

    // Afficher toutes les réservations d'un responsable
    @GetMapping("/mes-equipes")
    public ResponseEntity<List<Equipe>> getMesEquipes(Authentication auth) {
        // Récupérer le responsable connecté à partir de son nom d'utilisateur
        CompteResponsable responsable = responsableService.getResponsableByUsername(auth.getName());

        // Récupérer les réservations associées à ce responsable
        List<Equipe> equipes = equipeService.getAllEquipeByResponsable(responsable.getId());
        if (equipes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(equipes);
    }


    // Afficher une réservation par son ID
    @GetMapping("/{id}")
    public ResponseEntity<ReservationTerrain> getReservationById(@PathVariable Long id) {
        try {
            // Récupérer une réservation par son ID
            ReservationTerrain reservation = reservationTerrainService.getReservationById(id);
            return ResponseEntity.ok(reservation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    // Afficher toutes les réservations
    @GetMapping("/")
    public ResponseEntity<List<ReservationTerrain>> getAllReservations() {
        try {
            // Récupérer toutes les réservations
            List<ReservationTerrain> reservations = reservationTerrainService.getAllReservations();
            return ResponseEntity.ok(reservations);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }




    @GetMapping("/disponibles")
    public ResponseEntity<List<Terrain>> getTerrainsDisponibles() {
        List<Terrain> terrains = terrainRepository.findByEstDisponible(true);
        return ResponseEntity.ok(terrains);
    }

*/



}
