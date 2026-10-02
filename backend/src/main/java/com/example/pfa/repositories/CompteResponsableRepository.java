package com.example.pfa.repositories;

import com.example.pfa.entities.CompteResponsable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CompteResponsableRepository extends JpaRepository<CompteResponsable, Long> {

    Optional<CompteResponsable> findByPasswordAndEmail(String email, String password);
    // Trouver un responsable par son email
    //Optional<CompteResponsable> findByEmail(String email);

    CompteResponsable findByEmail(String email);
    CompteResponsable findByResetToken(String resetToken);

    Optional<CompteResponsable> findByemail(String email);

}
