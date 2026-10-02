package com.example.pfa.entities;
import jakarta.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
public class DemandeCreation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le type de demande est obligatoire")
    private String typeDemande; // "CLUB" ou "EQUIPE"

    // État de la demande
    @Enumerated(EnumType.STRING)
    private EtatDemande etat = EtatDemande.EN_ATTENTE;

    private LocalDateTime dateCreation = LocalDateTime.now();
    private LocalDateTime dateTraitement;

    // Commentaire de l'administrateur (optionnel)
    private String commentaireAdmin;

    // Relation avec le responsable qui fait la demande
    @ManyToOne
    @JoinColumn(name = "responsable_id", nullable = false)
    private CompteResponsable responsable;

    // Données de la demande - stockées en JSON ou références aux entités
    private String nom;
    private String etablissement; // Pour Club
    private Integer nbrJoueurs; // Pour Equipe
    private String imageURL;

    // Référence à l'entité créée (après approbation)
    @OneToOne
    private Club club;

    @OneToOne
    private Equipe equipe;

    // Enum pour les états possibles d'une demande
    public enum EtatDemande {
        EN_ATTENTE,
        APPROUVEE,
        REFUSEE
    }

    // Constructeurs
    public DemandeCreation() {
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeDemande() {
        return typeDemande;
    }

    public void setTypeDemande(String typeDemande) {
        this.typeDemande = typeDemande;
    }

    public EtatDemande getEtat() {
        return etat;
    }

    public void setEtat(EtatDemande etat) {
        this.etat = etat;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateTraitement() {
        return dateTraitement;
    }

    public void setDateTraitement(LocalDateTime dateTraitement) {
        this.dateTraitement = dateTraitement;
    }

    public String getCommentaireAdmin() {
        return commentaireAdmin;
    }

    public void setCommentaireAdmin(String commentaireAdmin) {
        this.commentaireAdmin = commentaireAdmin;
    }

    public CompteResponsable getResponsable() {
        return responsable;
    }

    public void setResponsable(CompteResponsable responsable) {
        this.responsable = responsable;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEtablissement() {
        return etablissement;
    }

    public void setEtablissement(String etablissement) {
        this.etablissement = etablissement;
    }

    public Integer getNbrJoueurs() {
        return nbrJoueurs;
    }

    public void setNbrJoueurs(Integer nbrJoueurs) {
        this.nbrJoueurs = nbrJoueurs;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public Equipe getEquipe() {
        return equipe;
    }

    public void setEquipe(Equipe equipe) {
        this.equipe = equipe;
    }
}