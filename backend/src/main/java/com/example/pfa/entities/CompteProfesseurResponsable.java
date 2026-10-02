package com.example.pfa.entities;
import jakarta.persistence.Entity;
@Entity
public class CompteProfesseurResponsable extends CompteResponsable{


    public CompteProfesseurResponsable() {
    }
    public CompteProfesseurResponsable(String nom_responsable, String prenom_responsable, String email, String password) {
        super(nom_responsable, prenom_responsable, email, password);
    }



}
