package com.example.pfa.repositories;
import com.example.pfa.entities.Terrain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TerrainRepository extends JpaRepository<Terrain, Long> {
    // Exemple : trouver les terrains disponibles
   // java.util.List<Terrain> findByEstDisponibleTrue();

    List<Terrain> findByEstDisponible(boolean estDisponible);
}