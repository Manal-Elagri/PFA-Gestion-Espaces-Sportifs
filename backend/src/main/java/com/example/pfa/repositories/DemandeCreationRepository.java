package com.example.pfa.repositories;

import com.example.pfa.entities.DemandeCreation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeCreationRepository extends JpaRepository<DemandeCreation, Long> {

    // Trouver les demandes en attente
    List<DemandeCreation> findByEtat(DemandeCreation.EtatDemande etat);

    // Trouver les demandes par responsable
    List<DemandeCreation> findByResponsableId(Long responsableId);

    // Trouver les demandes en attente d'un type spécifique
    List<DemandeCreation> findByEtatAndTypeDemande(DemandeCreation.EtatDemande etat, String typeDemande);
}