package com.example.pfa.entities;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class ClubCompetition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    private LocalDate dateInscription;

    @Enumerated(EnumType.STRING)
    private StatutParticipation statutParticipation = StatutParticipation.INSCRIT;

    public ClubCompetition() {
        this.dateInscription = LocalDate.now(); // Définit automatiquement la date d'inscription
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public Competition getCompetition() {
        return competition;
    }

    public void setCompetition(Competition competition) {
        this.competition = competition;
    }

    public LocalDate getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(LocalDate dateInscription) {
        this.dateInscription = dateInscription;
    }

    public StatutParticipation getStatutParticipation() {
        return statutParticipation;
    }

    public void setStatutParticipation(StatutParticipation statutParticipation) {
        this.statutParticipation = statutParticipation;
    }
}