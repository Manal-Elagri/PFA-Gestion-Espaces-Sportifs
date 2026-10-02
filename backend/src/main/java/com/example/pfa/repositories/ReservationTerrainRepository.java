package com.example.pfa.repositories;

import com.example.pfa.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationTerrainRepository extends JpaRepository<ReservationTerrain, Long> {

    // Toutes les réservations en attente
    @Query("SELECT r FROM ReservationTerrain r WHERE r.etatReservation = 'EN_ATTENTE'")
    List<ReservationTerrain> findReservationsEnAttente();

    // Toutes les réservations validées
    @Query("SELECT r FROM ReservationTerrain r WHERE r.etatReservation = 'VALIDEE'")
    List<ReservationTerrain> findReservationsValidees();

    // Toutes les réservations refusées
    @Query("SELECT r FROM ReservationTerrain r WHERE r.etatReservation = 'REFUSEE'")
    List<ReservationTerrain> findReservationsRefusees();

    // Les réservations pour un terrain donné
    List<ReservationTerrain> findByTerrainId(Long terrainId);


  /*  // Les réservations à partir d’une certaine date
    @Query("SELECT r FROM ReservationTerrain r WHERE r.dateReservation >= :date")
    List<ReservationTerrain> findReservationsAfterDate(@Param("date") LocalDateTime date);*/

    // Les réservations non encore validées depuis une certaine date
    @Query("SELECT r FROM ReservationTerrain r WHERE r.etatReservation = 'EN_ATTENTE' AND r.dateReservation <= :limite")
    List<ReservationTerrain> findReservationsEnAttenteDepuis(@Param("limite") LocalDateTime limite);

    // Statistiques : nombre total de réservations
    @Query("SELECT COUNT(r) FROM ReservationTerrain r")
    Long countAllReservations();

    // Statistiques : nombre de réservations en attente
    @Query("SELECT COUNT(r) FROM ReservationTerrain r WHERE r.etatReservation = 'EN_ATTENTE'")
    Long countReservationsEnAttente();

    // Statistiques : nombre de réservations validées
    @Query("SELECT COUNT(r) FROM ReservationTerrain r WHERE r.etatReservation = 'VALIDEE'")
    Long countReservationsValidees();

    // Statistiques : nombre de réservations par terrain
    @Query("SELECT COUNT(r) FROM ReservationTerrain r WHERE r.terrain.id = :terrainId")
    Long countReservationsByTerrain(@Param("terrainId") Long terrainId);


    //Optional<ReservationTerrain> findByEquipeAndTerrain(Equipe equipe, Terrain terrain);

    // Trouver toutes les participations d'un club
    List<ReservationTerrain> findByEquipeId(Long equipeId);



    /// ////////////////////////////////////


    // Méthodes existantes
    Optional<ReservationTerrain> findByEquipeAndTerrain(Equipe equipe, Terrain terrain);

    // Nouvelles méthodes pour le calendrier
    List<ReservationTerrain> findByEtatReservation(EtatReservationTerrain etatReservation);

    List<ReservationTerrain> findByTerrainAndEtatReservation(Terrain terrain, EtatReservationTerrain etatReservation);

    List<ReservationTerrain> findByEtatReservationAndCalendrierBetween(
            EtatReservationTerrain etatReservation, LocalDate dateDebut, LocalDate dateFin);

    List<ReservationTerrain> findByTerrainAndEtatReservationAndCalendrierBetween(
            Terrain terrain, EtatReservationTerrain etatReservation, LocalDate dateDebut, LocalDate dateFin);

    boolean existsByTerrainAndCalendrierAndEtatReservation(
            Terrain terrain, LocalDate calendrier, EtatReservationTerrain etatReservation);

    Optional<ReservationTerrain> findByEquipeAndTerrainAndCalendrier(
            Equipe equipe, Terrain terrain, LocalDate calendrier);





    List<ReservationTerrain> findByTerrain_IdAndEtatReservation(Long terrainId, EtatReservationTerrain etatReservation);

}


