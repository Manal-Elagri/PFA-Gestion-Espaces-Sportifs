package com.example.pfa.services;

import com.example.pfa.entities.*;
import com.example.pfa.repositories.ClubCompetitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParticipationCompetitionService {


    @Autowired
    private ClubCompetitionRepository clubCompetitionRepository;

    // Rejoindre une compétition
    public ClubCompetition joinCompetition(Club club, Competition competition) {
        // Vérifier si le club est déjà inscrit à la compétition
         Optional<ClubCompetition> existingParticipation = clubCompetitionRepository
                .findByClubAndCompetition(club, competition);

        if (existingParticipation.isPresent()) {
            throw new RuntimeException("Le club est déjà inscrit à cette compétition");
        }

        ClubCompetition participation = new ClubCompetition();
        participation.setClub(club);
        participation.setCompetition(competition);
        participation.setStatutParticipation(StatutParticipation.INSCRIT);  // Statut par défaut : INSCRIT

        return clubCompetitionRepository.save(participation);
    }

    // Annuler une participation à une compétition (en supprimant l'enregistrement)
    public void cancelParticipation(Club club, Competition competition) {
        Optional<ClubCompetition> participation = clubCompetitionRepository
                .findByClubAndCompetition(club, competition);

        if (participation.isEmpty()) {
            throw new RuntimeException("Le club n'est pas inscrit à cette compétition");
        }

        // Supprimer la participation
        clubCompetitionRepository.delete(participation.get());
    }



    // Obtenir toutes les compétitions d'un club
    public List<ClubCompetition> getCompetitionsByClub(Club club) {
        return clubCompetitionRepository.findByClub(club);
    }



}
