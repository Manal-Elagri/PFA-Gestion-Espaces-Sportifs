package com.example.pfa.repositories;
import com.example.pfa.entities.ResultatMatchs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultatMatchsRepository extends JpaRepository<ResultatMatchs, Long> {
    // Méthodes personnalisées si besoin (ex: trouver tous les matchs d'une compétition)
}