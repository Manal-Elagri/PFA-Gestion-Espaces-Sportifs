package com.example.pfa.repositories;

import com.example.pfa.entities.CompteEtudiantResponsable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompteEtudiantResponsableRepository extends JpaRepository<CompteEtudiantResponsable, Long> {
}
