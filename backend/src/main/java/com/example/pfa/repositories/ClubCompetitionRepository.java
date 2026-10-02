package com.example.pfa.repositories;

import com.example.pfa.entities.Club;
import com.example.pfa.entities.ClubCompetition;
import com.example.pfa.entities.Competition;
import com.example.pfa.entities.StatutParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubCompetitionRepository extends JpaRepository<ClubCompetition, Long> {

    // Trouver toutes les participations d'un club dans une compétition donnée
    @Query("SELECT cc FROM ClubCompetition cc WHERE cc.club.id = :clubId AND cc.competition.id = :competitionId")
    List<ClubCompetition> findByClubAndCompetition(Long clubId, Long competitionId);

    // Trouver toutes les participations d'un club
    List<ClubCompetition> findByClubId(Long clubId);

    // Trouver toutes les participations d'une compétition
    List<ClubCompetition> findByCompetitionId(Long competitionId);

    // Trouver toutes les participations avec un statut spécifique
    List<ClubCompetition> findByStatutParticipation(StatutParticipation statutParticipation);

    // Trouver toutes les participations des clubs inscrits à une compétition
    List<ClubCompetition> findByCompetitionIdAndStatutParticipation(Long competitionId, StatutParticipation statutParticipation);


    // Trouver une participation en fonction du club et de la compétition
    Optional<ClubCompetition> findByClubAndCompetition(Club club, Competition competition);

    // Trouver toutes les compétitions auxquelles un club est inscrit
    List<ClubCompetition> findByClub(Club club);

    int countByStatutParticipationAndClubId(StatutParticipation statutParticipation, Long clubId);



    Optional<ClubCompetition> getParticipationById(Long id);

}
