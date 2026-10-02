package com.example.pfa.entities;

import jakarta.persistence.*;

@Entity
public class Equipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int nbr_joueurs ;
    private String nom_equipe;
    private String imageURL;

    // Le responsable qui fait la réservation (étudiant ou professeur)
    @ManyToOne
    @JoinColumn(name = "responsable_id", nullable = false)
    private CompteResponsable responsable;

    public Equipe() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNbr_joueurs() {
        return nbr_joueurs;
    }

    public void setNbr_joueurs(int nbr_joueurs) {
        this.nbr_joueurs = nbr_joueurs;
    }

    public String getNom_equipe() {
        return nom_equipe;
    }

    public void setNom_equipe(String nom_equipe) {
        this.nom_equipe = nom_equipe;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public CompteResponsable getResponsable() {
        return responsable;
    }

    public void setResponsable(CompteResponsable responsable) {
        this.responsable = responsable;
    }
}
