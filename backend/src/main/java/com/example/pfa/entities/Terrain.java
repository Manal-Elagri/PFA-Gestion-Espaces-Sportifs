package com.example.pfa.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.*;

@Entity
public class Terrain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String imageURL;
    private String mesure ;
    private boolean estDisponible;


    @Enumerated(EnumType.STRING)
    private CategorieTerrain categorieTerrain;

    // Constructeurs, getters et setters
    public Terrain() {

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

    public String getMesure() {
        return mesure;
    }

    public void setMesure(String mesure) {
        this.mesure = mesure;
    }

    public boolean isEstDisponible() {
        return estDisponible;
    }

    public void setEstDisponible(boolean estDisponible) {
        this.estDisponible = estDisponible;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public CategorieTerrain getCategorieTerrain() {
        return categorieTerrain;
    }

    public void setCategorieTerrain(CategorieTerrain categorieTerrain) {
        this.categorieTerrain = categorieTerrain;
    }
}