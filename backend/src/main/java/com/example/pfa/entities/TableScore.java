package com.example.pfa.entities;

import jakarta.persistence.*;

@Entity
public class TableScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club clubs;

    private int matchsJoues;
    private int matchsGagnes;
    private int matchsPerdus;
    private int matchsNuls;
    private int points;

    // Constructeur par défaut
    public TableScore() {
        this.matchsJoues = 0;
        this.matchsGagnes = 0;
        this.matchsPerdus = 0;
        this.matchsNuls = 0;
        this.points = 0;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Club getClubs() {
        return clubs;
    }

    public void setClubs(Club clubs) {
        this.clubs = clubs;
    }

    public int getMatchsJoues() {
        return matchsJoues;
    }

    public void setMatchsJoues(int matchsJoues) {
        this.matchsJoues = matchsJoues;
    }

    public int getMatchsGagnes() {
        return matchsGagnes;
    }

    public void setMatchsGagnes(int matchsGagnes) {
        this.matchsGagnes = matchsGagnes;
    }

    public int getMatchsPerdus() {
        return matchsPerdus;
    }

    public void setMatchsPerdus(int matchsPerdus) {
        this.matchsPerdus = matchsPerdus;
    }

    public int getMatchsNuls() {
        return matchsNuls;
    }

    public void setMatchsNuls(int matchsNuls) {
        this.matchsNuls = matchsNuls;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    // Méthode pour mettre à jour le score
    public void enregistrerMatch(int butsEquipe, int butsAdverse) {
        this.matchsJoues++;

        if (butsEquipe > butsAdverse) {
            this.matchsGagnes++;
            this.points += 3;  // Victoire = 3 points
        } else if (butsEquipe < butsAdverse) {
            this.matchsPerdus++;
        } else {
            this.matchsNuls++;
            this.points += 1;  // Match nul = 1 point
        }
    }
}
