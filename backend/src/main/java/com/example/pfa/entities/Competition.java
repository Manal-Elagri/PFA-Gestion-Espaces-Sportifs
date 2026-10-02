package com.example.pfa.entities;

import jakarta.persistence.*;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
public class Competition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;
    private String imageURL;

    @NotNull
    private LocalDate dateDebut;
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    private StatutCompetition etatCompetition = StatutCompetition.En_cours;

    @Enumerated(EnumType.STRING)
    private CategorieCompetition CategorieCompetition;


    @Enumerated(EnumType.STRING)
    private TypeDeSport typedesport;

    public Competition() {
    }

    public CategorieCompetition getCategorieCompetition() {
        return CategorieCompetition;
    }

    public void setCategorieCompetition(CategorieCompetition categorieCompetition) {
        CategorieCompetition = categorieCompetition;
    }

    public TypeDeSport getTypedesport() {
        return typedesport;
    }

    public void setTypedesport(TypeDeSport typedesport) {
        this.typedesport = typedesport;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public @NotNull LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(@NotNull LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public StatutCompetition getEtatCompetition() {
        return etatCompetition;
    }

    public void setEtatCompetition(StatutCompetition etatCompetition) {
        this.etatCompetition = etatCompetition;
    }
}
