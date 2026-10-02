/*package com.example.pfa.entities;
import jakarta.persistence.*;

@Entity
public class ProfesseurEquipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int nbr_joueurs ;
    private String nom_equipe;
    private String imageURL;
    @ManyToOne
    @JoinColumn(name = "professeurresponsable_id", nullable = false)
    private CompteProfesseurResponsable professeur_responsable;

    public ProfesseurEquipe() {
    }

    public ProfesseurEquipe(Long id, int nbr_joueurs, String nom_equipe, String imageURL) {
        this.id = id;
        this.nbr_joueurs = nbr_joueurs;
        this.nom_equipe = nom_equipe;
        this.imageURL = imageURL;
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
} */
