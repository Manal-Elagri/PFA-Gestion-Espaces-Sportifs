package com.example.pfa.services;

import com.example.pfa.entities.Club;
import com.example.pfa.entities.CompteResponsable;
import com.example.pfa.entities.Equipe;
import com.example.pfa.repositories.EquipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipeService {

     @Autowired
    private EquipeRepository equipeRepository;

    @Autowired
    private CompteResponsableService compteResponsableService;


    //Création d'une équipe
    public Equipe createEquipe(Long responsableId, Equipe equipe) {
        // Trouver le responsable
        Optional<CompteResponsable> responsableOpt = compteResponsableService.findById(responsableId);
        if (responsableOpt.isPresent()) {
            CompteResponsable responsable = responsableOpt.get(); // Récupérer l'objet responsable depuis l'Optional
            equipe.setResponsable(responsable); // Associer l'équipe au responsable
            return equipeRepository.save(equipe);
        } else {
            throw new RuntimeException("Responsable non trouvé");
        }
    }


    // Modifier une équipe existante
    public Equipe updateEquipe(Long equipeId, Equipe equipeDetails) {
        Optional<Equipe> equipeOpt = equipeRepository.findById(equipeId);
        if (equipeOpt.isPresent()) {
            Equipe equipe = equipeOpt.get();
            equipe.setNom_equipe(equipeDetails.getNom_equipe());
            equipe.setNbr_joueurs(equipeDetails.getNbr_joueurs());
            equipe.setImageURL(equipeDetails.getImageURL());
            return equipeRepository.save(equipe);
        } else {
            throw new RuntimeException("Équipe non trouvée");
        }
    }

    // Supprimer une équipe
    public void deleteEquipe(Long equipeId) {
        Optional<Equipe> equipeOpt = equipeRepository.findById(equipeId);
        if (equipeOpt.isPresent()) {
            equipeRepository.delete(equipeOpt.get());
        } else {
            throw new RuntimeException("Équipe non trouvée");
        }
    }

    // Afficher toutes les équipes d'un responsable
    public List<Equipe> getAllEquipeByResponsable(Long responsableId) {
        Optional<CompteResponsable> responsableOpt = compteResponsableService.findById(responsableId);
        if (responsableOpt.isPresent()) {
            CompteResponsable responsable = responsableOpt.get();
            return equipeRepository.findByResponsable(responsable);
        } else {
            throw new RuntimeException("Responsable non trouvé");
        }
    }

    // Trouver une équipe par son ID
    public Equipe getEquipeById(Long equipeId) {
        Optional<Equipe> equipeOpt = equipeRepository.findById(equipeId);
        if (equipeOpt.isPresent()) {
            return equipeOpt.get();
        } else {
            throw new RuntimeException("Équipe non trouvée");
        }
    }



}
