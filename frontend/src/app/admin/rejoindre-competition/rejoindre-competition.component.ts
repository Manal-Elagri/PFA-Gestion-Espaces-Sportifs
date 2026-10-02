import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CompetitionService } from '../../services/competition.service';
import { 
  Competition, 
  Club, 
  ClubCompetition, 
  StatutParticipation, 
  StatutCompetition 
} from '../../services/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rejoindre-competition',
  templateUrl: './rejoindre-competition.component.html',
  styleUrls: ['./rejoindre-competition.component.css']
})
export class RejoindreCompetitionComponent implements OnInit {
  // Listes des données
  competitions: Competition[] = [];
  clubs: Club[] = [];
  participations: ClubCompetition[] = [];
  selectedParticipation: ClubCompetition | null = null;
  // Exposer l'enum pour l'utiliser dans le template
  StatutParticipation = StatutParticipation;
  
  // Filtres
  clubFilter = new FormControl('');
  competitionFilter = new FormControl('');
  statusFilter = new FormControl('');
  
  // Vue active
  activeView: 'all' | 'byClub' | 'byCompetition' | 'stats' = 'all';
  
  // Sélections
  selectedClubId: number | null = null;
  selectedCompetitionId: number | null = null;
  
  // Statistiques
  dashboardStats: any = {
    totalParticipations: 0,
    participationsEnCours: 0,
    participationsTerminees: 0,
    participationsAnnulees: 0
  };
  
  // Chargement
  loading = false;
  error: string | null = null;
  
  constructor(
    private competitionService: CompetitionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAllData();
    
    // Écouter les changements de filtres
    this.clubFilter.valueChanges.subscribe(() => this.applyFilters());
    this.competitionFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  loadAllData(): void {
    this.loading = true;
    this.error = null;
    
    Promise.all([
      this.loadClubs(),
      this.loadCompetitions(),
      this.loadAllParticipations(),
      this.loadStats()
    ]).finally(() => {
      this.loading = false;
    });
  }

  loadClubs(): Promise<void> {
    return new Promise((resolve) => {
      this.competitionService.getMesClubs().subscribe({
        next: (data) => {
          this.clubs = data;
          resolve();
        },
        error: (err) => {
          this.error = `Erreur lors du chargement des clubs: ${err.message}`;
          this.showMessage(this.error, true);
          resolve();
        }
      });
    });
  }

  loadCompetitions(): Promise<void> {
    return new Promise((resolve) => {
      this.competitionService.getCompetitionsAVenir().subscribe({
        next: (data) => {
          this.competitions = data;
          resolve();
        },
        error: (err) => {
          this.error = `Erreur lors du chargement des compétitions: ${err.message}`;
          this.showMessage(this.error, true);
          resolve();
        }
      });
    });
  }

  loadAllParticipations(): Promise<void> {
    return new Promise((resolve) => {
      // Réinitialiser le tableau des participations
      this.participations = [];
      
      // Utiliser la nouvelle méthode pour charger toutes les participations
      this.competitionService.getAllParticipations().subscribe({
        next: (participations) => {
          console.log('Toutes les participations chargées:', participations);
          
          // Vérifier si les objets ont la structure attendue
          if (participations.length > 0) {
            // Vérifier si les objets club et competition sont présents
            const firstParticipation = participations[0];
            if (!firstParticipation.club || !firstParticipation.competition) {
              console.error('Structure de participation incorrecte:', firstParticipation);
              this.error = "La structure des données de participation est incorrecte. Les objets club et competition sont manquants.";
              this.showMessage(this.error, true);
            }
          }
          
          this.participations = participations;
          resolve();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des participations:', err);
          this.error = `Erreur lors du chargement des participations: ${err.message}`;
          this.showMessage(this.error, true);
          resolve();
        }
      });
    });
  }

  loadParticipationsByClub(clubId: number): void {
    this.loading = true;
    this.selectedClubId = clubId;
    this.selectedCompetitionId = null; // Réinitialiser l'autre filtre
    this.activeView = 'byClub';
    
    // Vider le tableau des participations avant de charger les nouvelles
    this.participations = [];
    
    this.competitionService.getParticipationsParClub(clubId).subscribe({
      next: (data) => {
        this.participations = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Erreur lors du chargement des participations du club: ${err.message}`;
        this.showMessage(this.error, true);
        this.loading = false;
      }
    });
  }

  loadParticipationsByCompetition(competitionId: number): void {
    this.loading = true;
    this.selectedCompetitionId = competitionId;
    this.selectedClubId = null; // Réinitialiser l'autre filtre
    this.activeView = 'byCompetition';
    
    // Vider le tableau des participations avant de charger les nouvelles
    this.participations = [];
    
    this.competitionService.getParticipationsParCompetition(competitionId).subscribe({
      next: (data) => {
        this.participations = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Erreur lors du chargement des participations à la compétition: ${err.message}`;
        this.showMessage(this.error, true);
        this.loading = false;
      }
    });
  }

  loadStats(): Promise<void> {
    return new Promise((resolve) => {
      this.competitionService.getStatsParticipations().subscribe({
        next: (data) => {
          this.dashboardStats = data;
          resolve();
        },
        error: (err) => {
          this.error = `Erreur lors du chargement des statistiques: ${err.message}`;
          this.showMessage(this.error, true);
          resolve();
        }
      });
    });
  }

  changeParticipationStatus(participation: ClubCompetition, newStatus: StatutParticipation): void {
    this.loading = true;
    
    this.competitionService.changeParticipationStatus(participation.id, newStatus).subscribe({
      next: () => {
        // Mettre à jour le statut localement
        participation.statutParticipation = newStatus;
        
        // Feedback utilisateur
        this.showMessage(`Statut de participation modifié avec succès: ${this.getStatusText(newStatus)}`);
        
        // Recharger les statistiques
        this.loadStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = `Erreur lors de la modification du statut: ${err.message}`;
        this.showMessage(this.error, true);
        this.loading = false;
      }
    });
  }

  selectParticipation(participation: ClubCompetition): void {
    this.selectedParticipation = participation;
  }

  closeDetails(): void {
    this.selectedParticipation = null;
  }

  setActiveView(view: 'all' | 'byClub' | 'byCompetition' | 'stats'): void {
    this.activeView = view;
    
    if (view === 'all') {
      // Réinitialiser les sélections
      this.selectedClubId = null;
      this.selectedCompetitionId = null;
      // Vider et recharger les participations
      this.participations = [];
      this.loadAllParticipations();
    } else if (view === 'stats') {
      this.loadStats();
    } else if (view === 'byClub') {
      // Si on clique sur "Par club" sans avoir sélectionné un club
      if (this.selectedClubId === null && this.clubs.length > 0) {
        // Afficher un message pour demander à l'utilisateur de sélectionner un club
        this.showMessage("Veuillez sélectionner un club en cliquant sur son nom dans la liste des participations");
      }
    } else if (view === 'byCompetition') {
      // Si on clique sur "Par compétition" sans avoir sélectionné une compétition
      if (this.selectedCompetitionId === null && this.competitions.length > 0) {
        // Afficher un message pour demander à l'utilisateur de sélectionner une compétition
        this.showMessage("Veuillez sélectionner une compétition en cliquant sur son nom dans la liste des participations");
      }
    }
  }

  applyFilters(): void {
    // Implémenter la logique de filtrage ici
    // Pour l'instant, nous rechargeons simplement toutes les données
    
    // Vider le tableau avant de recharger
    this.participations = [];
    this.loadAllParticipations();
  }

  getStatusText(status: StatutParticipation): string {
    switch (status) {
      case StatutParticipation.INSCRIT:
        return 'En attente';
      case StatutParticipation.VALIDE:
        return 'Validée';
      case StatutParticipation.ELIMINE:
        return 'Éliminée';
      default:
        return 'Inconnu';
    }
  }

  getStatusClass(status: StatutParticipation): string {
    switch (status) {
      case StatutParticipation.INSCRIT:
        return 'status-pending';
      case StatutParticipation.VALIDE:
        return 'status-approved';
      case StatutParticipation.ELIMINE:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return 'Non défini';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getClubName(clubId: number): string {
    const club = this.clubs.find(c => c.id === clubId);
    return club ? club.nom : 'Club inconnu';
  }

  getCompetitionName(competitionId: number): string {
    const competition = this.competitions.find(c => c.id === competitionId);
    return competition ? competition.nom : 'Compétition inconnue';
  }

  showMessage(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: isError ? ['error-snackbar'] : ['info-snackbar']
    });
  }
}