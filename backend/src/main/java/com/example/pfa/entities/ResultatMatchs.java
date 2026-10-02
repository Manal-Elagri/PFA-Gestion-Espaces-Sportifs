package com.example.pfa.entities;


import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class ResultatMatchs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Club clubA;

    @ManyToOne
    private Club clubB;

    private int scoreEquipeA;

    private int scoreEquipeB;

    private LocalDate dateMatch;

    @ManyToOne
    private Terrain terrain;

    @Enumerated(EnumType.STRING)
    private StatutMatch statutMatch;

    @ManyToOne
    private Competition competition; // ou Competition si tu l'utilises ailleurs

    private String commentaires; // optionnel pour des remarques

    public ResultatMatchs() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Club getClubA() {
        return clubA;
    }

    public void setClubA(Club clubA) {
        this.clubA = clubA;
    }

    public Club getClubB() {
        return clubB;
    }

    public void setClubB(Club clubB) {
        this.clubB = clubB;
    }

    public int getScoreEquipeA() {
        return scoreEquipeA;
    }

    public void setScoreEquipeA(int scoreEquipeA) {
        this.scoreEquipeA = scoreEquipeA;
    }

    public int getScoreEquipeB() {
        return scoreEquipeB;
    }

    public void setScoreEquipeB(int scoreEquipeB) {
        this.scoreEquipeB = scoreEquipeB;
    }

    public LocalDate getDateMatch() {
        return dateMatch;
    }

    public void setDateMatch(LocalDate dateMatch) {
        this.dateMatch = dateMatch;
    }

    public Terrain getTerrain() {
        return terrain;
    }

    public void setTerrain(Terrain terrain) {
        this.terrain = terrain;
    }

    public StatutMatch getStatutMatch() {
        return statutMatch;
    }

    public void setStatutMatch(StatutMatch statutMatch) {
        this.statutMatch = statutMatch;
    }

    public Competition getCompetition() {
        return competition;
    }

    public void setCompetition(Competition competition) {
        this.competition = competition;
    }

    public String getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(String commentaires) {
        this.commentaires = commentaires;
    }
}
