package com.example.pfa.entities;
import jakarta.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class ReservationTerrain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Le responsable qui fait la réservation (étudiant ou professeur)
    @ManyToOne
    @JoinColumn(name = "equipe_id", nullable = false)
    private Equipe equipe;
    @ManyToOne
    @JoinColumn(name = "terrain_id", nullable = false)
    private Terrain terrain;

    @NotNull
    private LocalDate calendrier;

    @NotNull
    private LocalDateTime dateReservation;
    @Enumerated(EnumType.STRING)
    private EtatReservationTerrain etatReservation = EtatReservationTerrain.EN_ATTENTE;
    // Constructeur par défaut
    public ReservationTerrain() {
        this.dateReservation = LocalDateTime.now();
    }

    public Equipe getEquipe() {
        return equipe;
    }

    public LocalDate getCalendrier() {
        return calendrier;
    }

    public void setCalendrier(LocalDate calendrier) {
        this.calendrier = calendrier;
    }

    public void setEquipe(Equipe equipe) {
        this.equipe = equipe;
    }

    public Terrain getTerrain() {
        return terrain;
    }

    public void setTerrain(Terrain terrain) {
        this.terrain = terrain;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public LocalDateTime getDateReservation() {
        return dateReservation;
    }

    public void setDateReservation(LocalDateTime dateReservation) {
        this.dateReservation = dateReservation;
    }

    public EtatReservationTerrain getEtatReservation() {
        return etatReservation;
    }

    public void setEtatReservation(EtatReservationTerrain etatReservation) {
        this.etatReservation = etatReservation;
    }


}







// Liste des menus avec quantités
   /* @ElementCollection
    @CollectionTable(name = "commande_menus", joinColumns = @JoinColumn(name = "commande_id"))
    private List<ResultatMatchs> menus = new ArrayList<>();*/


// Méthode pour calculer le prix total
  /*  public void calculerPrixTotal() {
        this.prixTotal = menus.stream()
                .mapToDouble(menuQuantite -> menuQuantite.getMenu().getPrix() * menuQuantite.getQuantite())
                .sum();
    }*/

// Ajouter un terrain à la commande
   /* public void ajouterMenu(Terrain terrain, int quantite) {
        ResultatMatchs existingMenuQuantite = menus.stream()
                .filter(mq -> mq.getMenu().equals(terrain))
                .findFirst()
                .orElse(null);

        if (existingMenuQuantite != null) {
            existingMenuQuantite.setQuantite(existingMenuQuantite.getQuantite() + quantite);
        } else {
            menus.add(new ResultatMatchs(terrain, quantite));
        }
        calculerPrixTotal();
    }*/

// Supprimer un terrain de la commande
  /*  public void supprimerMenu(Terrain terrain) {
        menus.removeIf(menuQuantite -> menuQuantite.getMenu().equals(terrain));
        calculerPrixTotal();
    }*/