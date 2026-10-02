import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../../services/competition.service';
import { Competition, Club, StatutParticipation } from '../../services/models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {

  competitions: Competition[] = [];
  mesClubs: Club[] = [];
  selectedClubId: number | null = null;
  loading: boolean = false;
  error: string | null = null;

  participations: any[] = [];
  statistiques = {
    inscrits: 0,
    valides: 0,
    elimines: 0
  };

  constructor(private competitionService: CompetitionService) {}

  ngOnInit(): void {
    this.fetchMesClubs();
    this.fetchCompetitions();
  }

  fetchCompetitions(): void {
    this.loading = true;
    this.competitionService.getCompetitionsAVenir()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: data => this.competitions = data,
        error: err => {
          console.error(err);
          this.error = 'Erreur lors du chargement des compétitions';
        }
      });
  }

  fetchMesClubs(): void {
    this.loading = true;
    this.competitionService.getMesClubs()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: data => {
          this.mesClubs = data;
          // Si des clubs sont disponibles, sélectionner le premier par défaut
          if (this.mesClubs.length > 0) {
            this.selectedClubId = this.mesClubs[0].id;
            this.fetchParticipationsDuClub(this.selectedClubId);
          }
        },
        error: err => {
          console.error(err);
          this.error = 'Erreur lors du chargement de vos clubs';
        }
      });
  }

  fetchParticipationsDuClub(clubId: number): void {
    this.loading = true;
    this.competitionService.getCompetitionsByClub(clubId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: data => {
          this.participations = data;
          this.calculerStatistiques();
        },
        error: err => {
          console.error(err);
          this.error = 'Erreur lors de la récupération des participations';
        }
      });
  }

  calculerStatistiques(): void {
    const stats = { inscrits: 0, valides: 0, elimines: 0 };
    
    for (let p of this.participations) {
      switch (p.statutParticipation) {
        case 'INSCRIT': stats.inscrits++; break;
        case 'VALIDE': stats.valides++; break;
        case 'ELIMINE': stats.elimines++; break;
      }
    }
    
    this.statistiques = stats;
  }

  onClubChange(event: any): void {
    const clubId = parseInt(event.target.value);
    this.selectedClubId = clubId;
    
    if (clubId) {
      this.loading = true;
      this.fetchParticipationsDuClub(clubId);
    }
  }

  rejoindreCompetition(competitionId: number): void {
    if (!this.selectedClubId) {
      this.error = "Veuillez sélectionner un club avant de rejoindre une compétition.";
      return;
    }
    
    this.loading = true;
    this.competitionService.joinCompetition(this.selectedClubId, competitionId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: res => {
          // Après inscription réussie, on rafraîchit les données
          this.fetchParticipationsDuClub(this.selectedClubId!);
          this.error = null;
        },
        error: err => {
          console.error(err);
          this.error = "Erreur lors de l'inscription : " + (err.error?.message || "Une erreur est survenue");
        }
      });
  }

  annulerParticipation(competitionId: number): void {
    if (!this.selectedClubId) {
      this.error = "Veuillez sélectionner un club.";
      return;
    }
    
    this.loading = true;
    this.competitionService.cancelParticipation(this.selectedClubId, competitionId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: res => {
          // Après annulation réussie, on rafraîchit les données
          this.fetchParticipationsDuClub(this.selectedClubId!);
          this.error = null;
        },
        error: err => {
          console.error(err);
          this.error = "Erreur lors de l'annulation : " + (err.error?.message || "Une erreur est survenue");
        }
      });
  }

  // Méthodes utilitaires pour les templates
  isParticipant(competitionId: number): boolean {
    return this.participations.some(p => p.competition.id === competitionId);
  }

  getStatutParticipation(competitionId: number): string {
    const participation = this.participations.find(p => p.competition.id === competitionId);
    return participation ? participation.statutParticipation : '';
  }

  canCancelParticipation(competitionId: number): boolean {
    const statut = this.getStatutParticipation(competitionId);
    return statut === 'INSCRIT'; // On peut annuler uniquement si le statut est INSCRIT
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'VALIDE': return 'text-success';
      case 'ELIMINE': return 'text-danger';
      case 'INSCRIT': return 'text-warning';
      default: return '';
    }
  }

  getStatusText(statut: string): string {
    switch (statut) {
      case 'VALIDE': return 'Validée';
      case 'ELIMINE': return 'Éliminée';
      case 'INSCRIT': return 'En attente';
      default: return 'Inconnu';
    }
  }
}