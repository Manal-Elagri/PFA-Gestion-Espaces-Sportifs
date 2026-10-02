package com.example.pfa.repositories;

import com.example.pfa.entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Admin findByPasswordAndEmail(String email, String password);

    Optional<Admin> findByEmail(String email);

}
