package com.example.pfa.repositories;
import com.example.pfa.entities.TableScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TableScoreRepository extends JpaRepository<TableScore, Long> {

    // Récupérer la table de score pour un club spécifique
    TableScore findByClubsId(Long clubId);
}