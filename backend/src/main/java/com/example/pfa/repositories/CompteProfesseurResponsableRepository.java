package com.example.pfa.repositories;

import com.example.pfa.entities.CompteProfesseurResponsable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompteProfesseurResponsableRepository extends JpaRepository<CompteProfesseurResponsable, Long> {
}
