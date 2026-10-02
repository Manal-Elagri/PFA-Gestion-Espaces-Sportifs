package com.example.pfa.services;

import com.example.pfa.entities.Club;
import com.example.pfa.entities.CompteResponsable;
import com.example.pfa.entities.DemandeCreation;
import com.example.pfa.entities.Equipe;
import com.example.pfa.repositories.ClubRepository;
import com.example.pfa.repositories.DemandeCreationRepository;
import com.example.pfa.repositories.EquipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Service
public class DemandeCreationService {

    @Autowired
    private DemandeCreationRepository demandeRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private EquipeRepository equipeRepository;

    /**
     * Créer une nouvelle demande pour un club
     */
    @Transactional
    public DemandeCreation creerDemandeClub(String nom, String etablissement, String imageURL, CompteResponsable responsable) {
        DemandeCreation demande = new DemandeCreation();
        demande.setTypeDemande("CLUB");
        demande.setNom(nom);
        demande.setEtablissement(etablissement);
        demande.setImageURL(imageURL);
        demande.setResponsable(responsable);

        return demandeRepository.save(demande);
    }

    /**
     * Créer une nouvelle demande pour une équipe
     */
    @Transactional
    public DemandeCreation creerDemandeEquipe(String nom, Integer nbrJoueurs, String imageURL, CompteResponsable responsable) {
        DemandeCreation demande = new DemandeCreation();
        demande.setTypeDemande("EQUIPE");
        demande.setNom(nom);
        demande.setNbrJoueurs(nbrJoueurs);
        demande.setImageURL(imageURL);
        demande.setResponsable(responsable);

        return demandeRepository.save(demande);
    }

    /**
     * Approuver une demande de création
     */
    @Transactional
    public DemandeCreation approuverDemande(Long demandeId, String commentaire) {
        Optional<DemandeCreation> optDemande = demandeRepository.findById(demandeId);

        if (!optDemande.isPresent()) {
            throw new RuntimeException("Demande non trouvée avec l'ID: " + demandeId);
        }

        DemandeCreation demande = optDemande.get();

        // Vérifier que la demande est en attente
        if (demande.getEtat() != DemandeCreation.EtatDemande.EN_ATTENTE) {
            throw new RuntimeException("La demande a déjà été traitée");
        }

        // Mettre à jour l'état de la demande
        demande.setEtat(DemandeCreation.EtatDemande.APPROUVEE);
        demande.setDateTraitement(LocalDateTime.now());
        demande.setCommentaireAdmin(commentaire);

        // Créer l'entité correspondante (club ou équipe)
        if ("CLUB".equals(demande.getTypeDemande())) {
            Club club = new Club();
            club.setNom(demande.getNom());
            club.setEtablissement(demande.getEtablissement());
            club.setImageURL(demande.getImageURL());
            club.setResponsable(demande.getResponsable());

            clubRepository.save(club);
            demande.setClub(club);
        } else if ("EQUIPE".equals(demande.getTypeDemande())) {
            Equipe equipe = new Equipe();
            equipe.setNom_equipe(demande.getNom());
            equipe.setNbr_joueurs(demande.getNbrJoueurs());
            equipe.setImageURL(demande.getImageURL());
            equipe.setResponsable(demande.getResponsable());

            equipeRepository.save(equipe);
            demande.setEquipe(equipe);
        }

        return demandeRepository.save(demande);
    }

    /**
     * Refuser une demande de création
     */
    @Transactional
    public DemandeCreation refuserDemande(Long demandeId, String commentaire) {
        Optional<DemandeCreation> optDemande = demandeRepository.findById(demandeId);

        if (!optDemande.isPresent()) {
            throw new RuntimeException("Demande non trouvée avec l'ID: " + demandeId);
        }

        DemandeCreation demande = optDemande.get();

        // Vérifier que la demande est en attente
        if (demande.getEtat() != DemandeCreation.EtatDemande.EN_ATTENTE) {
            throw new RuntimeException("La demande a déjà été traitée");
        }

        // Mettre à jour l'état de la demande
        demande.setEtat(DemandeCreation.EtatDemande.REFUSEE);
        demande.setDateTraitement(LocalDateTime.now());
        demande.setCommentaireAdmin(commentaire);

        return demandeRepository.save(demande);
    }

    /**
     * Obtenir toutes les demandes en attente
     */
    public List<DemandeCreation> getDemandesEnAttente() {
        return demandeRepository.findByEtat(DemandeCreation.EtatDemande.EN_ATTENTE);
    }

    /**
     * Obtenir les demandes par responsable
     */
    public List<DemandeCreation> getDemandesByResponsable(Long responsableId) {
        return demandeRepository.findByResponsableId(responsableId);
    }

    /**
     * Obtenir une demande par ID
     */
    public Optional<DemandeCreation> getDemandeById(Long id) {
        return demandeRepository.findById(id);
    }
}