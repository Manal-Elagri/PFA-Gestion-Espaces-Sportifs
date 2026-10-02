package com.example.pfa.repositories;
import com.example.pfa.entities.Club;
import com.example.pfa.entities.CompteResponsable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    // Récupérer tous les clubs
    List<Club> findAll();
    // Trouver tous les clubs associés à un responsable
    List<Club> findByResponsable(CompteResponsable responsable);
}
