package com.example.pfa.repositories;

import com.example.pfa.entities.CompteResponsable;
import com.example.pfa.entities.Equipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipeRepository extends JpaRepository<Equipe, Long> {

     List<Equipe> findAll();

    // Trouver toutes les équipes d'un responsable en fonction de son ID
    List<Equipe> findByResponsableId(Long responsableId);
    // Méthode pour trouver toutes les équipes associées à un responsable
    List<Equipe> findByResponsable(CompteResponsable responsable);

}
