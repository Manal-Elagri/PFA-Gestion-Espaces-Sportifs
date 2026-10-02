package com.example.pfa.services;

import com.example.pfa.entities.Club;
import com.example.pfa.entities.CompteResponsable;
import com.example.pfa.repositories.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClubService {
    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private CompteResponsableService compteResponsableService;

    // Créer un nouveau club
    public Club createClub(Long responsableId, Club club) {
        // Trouver le responsable
        Optional<CompteResponsable> responsableOpt = compteResponsableService.findById(responsableId);
        if (responsableOpt.isPresent()) {
            CompteResponsable responsable = responsableOpt.get();
            club.setResponsable(responsable); // Associer le club au responsable
            return clubRepository.save(club);
        } else {
            throw new RuntimeException("Responsable non trouvé");
        }
    }

    // Modifier un club existant
    public Club updateClub(Long id, Club updatedClub) {
        Optional<Club> clubOpt = clubRepository.findById(id);
        if (clubOpt.isPresent()) {
            Club club = clubOpt.get();
            club.setNom(updatedClub.getNom());
            club.setEtablissement(updatedClub.getEtablissement());
            club.setImageURL(updatedClub.getImageURL());
            club.setResponsable(updatedClub.getResponsable());
            return clubRepository.save(club);
        } else {
            throw new RuntimeException("Club non trouvé");
        }
    }

    // Supprimer un club
    public void deleteClub(Long id) {
        Optional<Club> clubOpt = clubRepository.findById(id);
        if (clubOpt.isPresent()) {
            clubRepository.delete(clubOpt.get());
        } else {
            throw new RuntimeException("Club non trouvé");
        }
    }

    // Récupérer un club par ID
    public Club getClubById(Long id) {
        Optional<Club> clubOpt = clubRepository.findById(id);
        if (clubOpt.isPresent()) {
            return clubOpt.get();
        } else {
            throw new RuntimeException("Club non trouvé");
        }
    }

    // Récupérer tous les clubs d'un responsable (étudiant ou professeur)
    public List<Club> getAllClubsByResponsable(Long responsableId) {
        Optional<CompteResponsable> responsableOpt = compteResponsableService.findById(responsableId);
        if (responsableOpt.isPresent()) {
            CompteResponsable responsable = responsableOpt.get();
            return clubRepository.findByResponsable(responsable);
        } else {
            throw new RuntimeException("Responsable non trouvé");
        }
    }

}
