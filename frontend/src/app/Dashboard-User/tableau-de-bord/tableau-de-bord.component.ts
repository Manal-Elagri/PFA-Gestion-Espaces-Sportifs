import { Component, OnInit } from '@angular/core';
import { TableauUserService } from '../../services/tableau-user.service';
import { 
  ReservationTerrain, 
  Terrain, 
  EtatReservationTerrain, 
  Equipe, 
  CategorieTerrain,
  JoursOccupes,
  CalendrierData
} from '../../services/models-terrain-reservation';
import { 
  Competition, 
  Club, 
  StatutParticipation, 
  ClubCompetition,
  TypeDeSport,
  StatutCompetition
} from '../../services/models';
import { forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-tableau-de-bord',
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.css']
})
export class TableauDeBordComponent implements OnInit {
  mesClubs: Club[] = [];
  mesEquipes: Equipe[] = [];
  competitionsAVenir: Competition[] = [];
  mesDemandes: any[] = [];
  
  // État du dashboard
  isLoading: boolean = true;
  errorMessage: string = '';
  
  // Filtres et tri
  filtreTypeSport: string = 'TOUS';
  filtreEtatCompetition: string = 'TOUS';
  typesSport = Object.values(TypeDeSport);
  
  // Stats
  totalClubs: number = 0;
  totalEquipes: number = 0;
  totalCompetitions: number = 0;
  totalDemandesEnAttente: number = 0;

  constructor(private tableauUserService: TableauUserService) {}

  // Rafraîchir les données
  rafraichirDonnees(): void {
    this.errorMessage = '';
    this.chargerDonnees();
  }

  ngOnInit(): void {
    this.chargerDonnees();
    
    // En cas d'absence de données, charger les données de test après 3 secondes
    setTimeout(() => {
      if (this.mesClubs.length === 0 && this.mesEquipes.length === 0 && 
          this.competitionsAVenir.length === 0 && this.mesDemandes.length === 0) {
        console.log('Aucune donnée chargée - Utilisation des données de test');
        const donnees = this.genererDonneesTest();
        this.mesClubs = donnees.clubs;
        this.mesEquipes = donnees.equipes;
        this.competitionsAVenir = donnees.competitions;
        this.mesDemandes = donnees.demandes;
        this.calculerStatistiques();
      }
    }, 3000);
  }

  chargerDonnees(): void {
    this.isLoading = true;
    
    // On va charger les données séquentiellement pour éviter les problèmes avec forkJoin
    this.tableauUserService.getMesClubs().subscribe({
      next: (clubs) => {
        this.mesClubs = clubs;
        console.log('Clubs chargés:', this.mesClubs);
        
        this.tableauUserService.getMesEquipes().subscribe({
          next: (equipes) => {
            this.mesEquipes = equipes;
            console.log('Équipes chargées:', this.mesEquipes);
            
            this.tableauUserService.getCompetitionsAVenir().subscribe({
              next: (competitions) => {
                this.competitionsAVenir = competitions;
                console.log('Compétitions chargées:', this.competitionsAVenir);
                
                this.tableauUserService.getMesDemandes().subscribe({
                  next: (demandes) => {
                    this.mesDemandes = demandes;
                    console.log('Demandes chargées:', this.mesDemandes);
                    
                    // Mise à jour des stats
                    this.calculerStatistiques();
                    this.isLoading = false;
                  },
                  error: (err) => {
                    console.error('Erreur lors du chargement des demandes:', err);
                    this.mesDemandes = this.genererDonneesTest().demandes;
                    this.calculerStatistiques();
                    this.isLoading = false;
                  }
                });
              },
              error: (err) => {
                console.error('Erreur lors du chargement des compétitions:', err);
                this.competitionsAVenir = this.genererDonneesTest().competitions;
                this.isLoading = false;
              }
            });
          },
          error: (err) => {
            console.error('Erreur lors du chargement des équipes:', err);
            this.mesEquipes = this.genererDonneesTest().equipes;
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clubs:', err);
        this.mesClubs = this.genererDonneesTest().clubs;
        this.isLoading = false;
      }
    });
  }

  calculerStatistiques(): void {
    this.totalClubs = this.mesClubs.length;
    this.totalEquipes = this.mesEquipes.length;
    this.totalCompetitions = this.competitionsAVenir.length;
    this.totalDemandesEnAttente = this.mesDemandes.filter(demande => 
      demande.etatReservation === EtatReservationTerrain.EN_ATTENTE).length;
  }

  // Filtrer les compétitions par type de sport
  filtrerCompetitionsParSport(): Competition[] {
    if (this.filtreTypeSport === 'TOUS') {
      return this.competitionsAVenir;
    }
    return this.competitionsAVenir.filter(comp => 
      comp.typedesport === this.filtreTypeSport);
  }

  // Formater la date pour l'affichage
  formaterDate(date: Date): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Générer des données de test pour l'affichage en cas d'erreur
  genererDonneesTest(): any {
    // Clubs de test
    const clubs: Club[] = [
      {
        id: 1,
        nom: 'Club Sportif Universitaire',
        etablissement: 'Université Mohamed V',
        imageURL: 'assets/images/default-club.png'
      },
      {
        id: 2,
        nom: 'Association Sportive EMI',
        etablissement: 'École Mohammadia d\'Ingénieurs',
        imageURL: 'assets/images/default-club.png'
      }
    ];
    
    // Équipes de test
    const equipes: Equipe[] = [
      {
        id: 1,
        nom_equipe: 'Équipe A Football',
        imageURL: 'assets/images/default-team.png',
        nbr_joueurs: 11
      },
      {
        id: 2,
        nom_equipe: 'Basket Heroes',
        imageURL: 'assets/images/default-team.png',
        nbr_joueurs: 8
      }
    ];
    
    // Compétitions à venir de test
    const competitions: Competition[] = [
      {
        id: 1,
        nom: 'Tournoi Universitaire',
        description: 'Grand tournoi inter-universitaire de football',
        imageURL: 'assets/images/default-competition.png',
        dateDebut: new Date('2025-06-15'),
        dateFin: new Date('2025-06-20'),
        etatCompetition: StatutCompetition.À_venir,
        categorieCompetition: 'TOURNOI_Ramadan' as any,
        typedesport: TypeDeSport.FOOTBALL
      },
      {
        id: 2,
        nom: 'Championnat de Basketball',
        description: 'Championnat régional de basketball',
        imageURL: 'assets/images/default-competition.png',
        dateDebut: new Date('2025-07-10'),
        dateFin: new Date('2025-07-12'),
        etatCompetition: StatutCompetition.À_venir,
        categorieCompetition: 'CHAMPIONNAT_Regional' as any,
        typedesport: TypeDeSport.BASKETBALL
      }
    ];
    
    // Demandes de test
    const demandes: any[] = [
      {
        id: 1,
        typeDemande: 'Réservation de terrain',
        dateDemande: new Date('2025-05-10'),
        objet: 'Terrain de football - Entraînement',
        etatReservation: EtatReservationTerrain.EN_ATTENTE
      },
      {
        id: 2,
        typeDemande: 'Inscription compétition',
        dateDemande: new Date('2025-05-12'),
        objet: 'Tournoi de football universitaire',
        etatReservation: EtatReservationTerrain.VALIDEE
      }
    ];
    
    return {
      clubs,
      equipes,
      competitions,
      demandes
    };
  }

  // Obtenir la classe CSS pour l'état de la compétition
  getClasseEtatCompetition(etat: StatutCompetition): string {
    switch(etat) {
      case StatutCompetition.EN_COURS:
        return 'etat-en-cours';
      case StatutCompetition.Terminé:
        return 'etat-terminee';
      case StatutCompetition.À_venir:
      default:
        return 'etat-a-venir';
    }
  }

  // Obtenir la classe CSS pour l'état de la demande
  getClasseEtatDemande(etat: EtatReservationTerrain): string {
    switch(etat) {
      case EtatReservationTerrain.VALIDEE:
        return 'etat-validee';
      case EtatReservationTerrain.REFUSEE:
        return 'etat-refusee';
      case EtatReservationTerrain.EN_ATTENTE:
      default:
        return 'etat-en-attente';
    }
  }



  getIconForDemandeType(type: string): string {
  switch (type?.toLowerCase()) {
    case 'réservation':
    case 'reservation':
      return 'fas fa-calendar-check';
    case 'inscription':
      return 'fas fa-user-plus';
    case 'adhésion':
    case 'adhesion':
      return 'fas fa-handshake';
    case 'matériel':
    case 'materiel':
      return 'fas fa-toolbox';
    default:
      return 'fas fa-file-alt';
  }
}
}