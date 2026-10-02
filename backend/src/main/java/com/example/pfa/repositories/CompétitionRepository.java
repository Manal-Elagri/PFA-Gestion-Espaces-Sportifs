package com.example.pfa.repositories;

import com.example.pfa.entities.Competition;
import com.example.pfa.entities.StatutCompetition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompétitionRepository extends JpaRepository<Competition, Long>{

    List<Competition> findByEtatCompetition(StatutCompetition etatCompetition);


}
