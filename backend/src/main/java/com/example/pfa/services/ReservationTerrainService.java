package com.example.pfa.services;

import com.example.pfa.entities.*;
import com.example.pfa.repositories.ReservationTerrainRepository;
import com.example.pfa.repositories.TerrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationTerrainService {


    @Autowired
    private ReservationTerrainRepository reservationTerrainRepository;

    @Autowired
    private TerrainRepository terrainRepository;

    // Créer une nouvelle réservation
    // Rejoindre une compétition
 /*   public ReservationTerrain passerReservation(Equipe equipe, Terrain terrain) {
        // Vérifier si le club est déjà inscrit à la compétition
        Optional<ReservationTerrain> existingParticipation = reservationTerrainRepository
                .findByEquipeAndTerrain(equipe, terrain);

        if (existingParticipation.isPresent()) {
            throw new RuntimeException("L'equipe est déjà inscrit à cette compétition");
        }

        ReservationTerrain reservation = new ReservationTerrain();
        reservation.setEquipe(equipe);
        reservation.setTerrain(terrain);
        reservation.setEtatReservation(EtatReservationTerrain.EN_ATTENTE);

        return reservationTerrainRepository.save(reservation);
    }


    // Supprimer une réservation
    public void deleteReservation(Equipe equipe, Terrain terrain) {
        Optional<ReservationTerrain> reservation = reservationTerrainRepository
                .findByEquipeAndTerrain(equipe, terrain);

        if (reservation.isEmpty()) {
            throw new RuntimeException("L'equipe  n'est pas passer la reservation à ce terrain");
        }

        // Supprimer la participation
        reservationTerrainRepository.delete(reservation.get());
    }



    // Afficher une réservation par son ID
    public ReservationTerrain getReservationById(Long id) {
        return reservationTerrainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID " + id));
    }



    // Afficher toutes les réservations (optionnel)
    public List<ReservationTerrain> getAllReservations() {
        return reservationTerrainRepository.findAll();
    }
*/
    // Créer une nouvelle réservation
    public ReservationTerrain passerReservation(Equipe equipe, Terrain terrain, LocalDate calendrier) {
        // Vérifier si le terrain est déjà réservé à cette date
        boolean terrainDejaReserve = reservationTerrainRepository
                .existsByTerrainAndCalendrierAndEtatReservation(
                        terrain, calendrier, EtatReservationTerrain.VALIDEE);

        if (terrainDejaReserve) {
            throw new RuntimeException("Ce terrain est déjà réservé à cette date");
        }

        // Vérifier si l'équipe a déjà une réservation en attente pour ce terrain
        Optional<ReservationTerrain> existingReservation = reservationTerrainRepository
                .findByEquipeAndTerrainAndCalendrier(equipe, terrain, calendrier);

        if (existingReservation.isPresent()) {
            throw new RuntimeException("L'équipe a déjà une réservation pour ce terrain à cette date");
        }

        ReservationTerrain reservation = new ReservationTerrain();
        reservation.setEquipe(equipe);
        reservation.setTerrain(terrain);
        reservation.setCalendrier(calendrier);
        reservation.setEtatReservation(EtatReservationTerrain.EN_ATTENTE);

        return reservationTerrainRepository.save(reservation);
    }

    // Supprimer une réservation
    // Dans ReservationTerrainService.java
    public void deleteReservationById(Long reservationId) {
        ReservationTerrain reservation = reservationTerrainRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        // Vérifiez si l'utilisateur a le droit d'annuler cette réservation
        // Par exemple, vérifiez si l'utilisateur est le propriétaire de l'équipe

        reservationTerrainRepository.delete(reservation);
    }

    // Afficher une réservation par son ID
    public ReservationTerrain getReservationById(Long id) {
        return reservationTerrainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée avec l'ID " + id));
    }

    // Afficher toutes les réservations
    public List<ReservationTerrain> getAllReservations() {
        return reservationTerrainRepository.findAll();
    }

    // Nouvelles méthodes pour le calendrier

    // Récupérer toutes les réservations validées
    public List<ReservationTerrain> getReservationsValidees() {
        return reservationTerrainRepository.findByEtatReservation(EtatReservationTerrain.VALIDEE);
    }

    // Récupérer toutes les réservations validées pour un mois spécifique
    public List<ReservationTerrain> getReservationsValideesParMois(int annee, int mois) {
        LocalDate debut = LocalDate.of(annee, mois, 1);
        LocalDate fin = debut.plusMonths(1).minusDays(1);

        return reservationTerrainRepository.findByEtatReservationAndCalendrierBetween(
                EtatReservationTerrain.VALIDEE, debut, fin);
    }

    // Récupérer les réservations validées pour un terrain spécifique
    public List<ReservationTerrain> getReservationsValideesParTerrain(Long terrainId) {
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain non trouvé avec l'ID " + terrainId));

        return reservationTerrainRepository.findByTerrainAndEtatReservation(terrain, EtatReservationTerrain.VALIDEE);
    }

    // Récupérer les réservations validées pour un terrain et un mois spécifiques
    public List<ReservationTerrain> getReservationsValideesParTerrainEtMois(Long terrainId, int annee, int mois) {
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain non trouvé avec l'ID " + terrainId));

        LocalDate debut = LocalDate.of(annee, mois, 1);
        LocalDate fin = debut.plusMonths(1).minusDays(1);

        return reservationTerrainRepository.findByTerrainAndEtatReservationAndCalendrierBetween(
                terrain, EtatReservationTerrain.VALIDEE, debut, fin);
    }

    // Récupérer un résumé des jours occupés par terrain
    public Map<Long, List<LocalDate>> getJoursOccupesParTerrain() {
        List<ReservationTerrain> reservationsValidees = getReservationsValidees();

        // Grouper les réservations par terrain et extraire les dates
        return reservationsValidees.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getTerrain().getId(),
                        Collectors.mapping(ReservationTerrain::getCalendrier, Collectors.toList())
                ));
    }

    // Vérifier si un terrain est disponible à une date spécifique
    public boolean isTerrainDisponible(Long terrainId, LocalDate date) {
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain non trouvé avec l'ID " + terrainId));

        // Vérifier si le terrain est généralement disponible
        if (!terrain.isEstDisponible()) {
            return false;
        }

        // Vérifier s'il n'y a pas de réservation validée pour cette date
        return !reservationTerrainRepository.existsByTerrainAndCalendrierAndEtatReservation(
                terrain, date, EtatReservationTerrain.VALIDEE);
    }


    public List<ReservationTerrain> findByTerrainIdAndEtatReservation(Long terrainId, EtatReservationTerrain etat) {
        return reservationTerrainRepository.findByTerrain_IdAndEtatReservation(terrainId, etat);
    }

}
