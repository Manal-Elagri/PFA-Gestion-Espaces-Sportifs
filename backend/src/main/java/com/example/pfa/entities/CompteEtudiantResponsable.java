package com.example.pfa.entities;
import jakarta.persistence.Entity;
import javax.validation.constraints.NotBlank;
@Entity
public class CompteEtudiantResponsable extends CompteResponsable{
    @NotBlank(message = "Filière est obligatoire")
    private String Filière ;


    public CompteEtudiantResponsable() {
    }

    public CompteEtudiantResponsable(String nom_responsable, String prenom_responsable, String email, String password, String filière) {
        super(nom_responsable, prenom_responsable, email, password);
        Filière = filière;
    }

    public String getFilière() {
        return Filière;
    }

    public void setFilière(String filière) {
        Filière = filière;
    }
}
