import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);

// Enum pour le statut des matchs (à adapter selon votre modèle)
enum StatutMatch {
  Reporté = 'Reporté',
  Annulé = 'Annulé',
  EN_Cours = 'EN_Cours',
  Terminé = 'Terminé'
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  // Données
  tableScores: any[] = [];
  matchResults: any[] = [];
  clubs: any[] = [];
  terrains: any[] = [];
  competitions: any[] = [];
  filteredScores: any[] = [];
  filteredMatches: any[] = [];

  // Formulaires
  scoreForm: FormGroup;
  matchResultForm: FormGroup;

  // État du composant
  activeTab: 'scores' | 'matches' | 'charts' = 'scores';
  isEditingScore = false;
  isEditingMatch = false;
  currentScoreId: number | null = null;
  currentMatchId: number | null = null;
  loading = false;
  error: string | null = null;
  scoreFilter: string = '';
  matchFilter: string = '';

  // Graphiques
  pointsChart: any;
  matchesChart: any;

  // Enum pour le template
  StatutMatch = StatutMatch;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    // Initialiser les formulaires
    this.scoreForm = this.fb.group({
      clubId: ['', Validators.required],
      matchsJoues: [0, [Validators.required, Validators.min(0)]],
      matchsGagnes: [0, [Validators.required, Validators.min(0)]],
      matchsNuls: [0, [Validators.required, Validators.min(0)]],
      matchsPerdus: [0, [Validators.required, Validators.min(0)]],
      points: [0, [Validators.required, Validators.min(0)]]
    });

    this.matchResultForm = this.fb.group({
      clubAId: ['', Validators.required],
      clubBId: ['', Validators.required],
      scoreEquipeA: [0, [Validators.required, Validators.min(0)]],
      scoreEquipeB: [0, [Validators.required, Validators.min(0)]],
      dateMatch: [new Date().toISOString().split('T')[0], Validators.required],
      terrainId: ['', Validators.required],
      statutMatch: ['', Validators.required],
      competitionId: ['', Validators.required],
      commentaires: ['']
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true;
    this.error = null;

    // Charger les tableaux de scores
    this.adminService.getAllScores().subscribe({
      next: (data) => {
        this.tableScores = data;
        this.filteredScores = [...this.tableScores];
        this.createPointsChart();
        this.loading = false;
      },
      error: (err) => {
        this.error = `Erreur lors du chargement des tableaux de scores: ${err.message}`;
        this.showMessage(this.error);
        this.loading = false;
      }
    });

    // Charger les clubs, terrains, compétitions, etc.
    this.loadClubs();
    this.loadTerrains();
    this.loadCompetitions();
    this.loadMatchResults();
  }

  loadClubs() {
    // Méthode à implémenter pour charger les clubs
    // Exemple:
     this.adminService.getAllClubs().subscribe({
     next: (data) => {
       this.clubs = data;
      },
      error: (err) => {
        this.error = `Erreur lors du chargement des clubs: ${err.message}`;
        this.showMessage(this.error);
      }
     });
    
  
  }

  loadTerrains() {

    this.adminService.getAllTerrain().subscribe({
      next: (data) => {
        this.terrains = data;
       },
       error: (err) => {
         this.error = `Erreur lors du chargement des clubs: ${err.message}`;
         this.showMessage(this.error);
       }
      });
  
  }

  loadCompetitions() {

    this.adminService.getAllCompetitions().subscribe({
      next: (data) => {
        this.competitions = data;
       },
       error: (err) => {
         this.error = `Erreur lors du chargement des clubs: ${err.message}`;
         this.showMessage(this.error);
       }
      });
    
  }

  loadMatchResults() {
    this.loading = true;
  this.adminService.getAllResultatMatchs().subscribe({
    next: (data) => {
      this.matchResults = data;
      this.filteredMatches = [...this.matchResults];
      this.loading = false;
    },
    error: (err) => {
      this.error = `Erreur lors du chargement des résultats de matchs: ${err.message}`;
      this.showMessage(this.error);
      this.loading = false;
    }
  });
  }

  // Méthodes pour les tableaux de scores
  // Méthodes pour les tableaux de scores
onSubmitScore() {
  if (this.scoreForm.invalid) {
    this.showMessage('Veuillez remplir correctement tous les champs obligatoires.');
    return;
  }

  // Récupérer les valeurs du formulaire
  const formValues = this.scoreForm.value;
  
  // Créer l'objet score avec la structure correcte
  const scoreData = {
    clubs: { id: formValues.clubId }, // Créer un objet clubs avec l'ID
    matchsJoues: formValues.matchsJoues,
    matchsGagnes: formValues.matchsGagnes,
    matchsNuls: formValues.matchsNuls,
    matchsPerdus: formValues.matchsPerdus,
    points: formValues.points
  };

  this.loading = true;

  if (this.isEditingScore && this.currentScoreId) {
    // Mise à jour d'un score existant
    this.adminService.updateScore(this.currentScoreId, scoreData).subscribe({
      next: (response) => {
        this.showMessage('Tableau de score mis à jour avec succès');
        this.resetScoreForm();
        this.loadAllData();
      },
      error: (err) => {
        this.error = `Erreur lors de la mise à jour du tableau de score: ${err.message}`;
        this.showMessage(this.error);
        this.loading = false;
      }
    });
  } else {
    // Création d'un nouveau score
    this.adminService.createScore(scoreData).subscribe({
      next: (response) => {
        this.showMessage('Tableau de score créé avec succès');
        this.resetScoreForm();
        this.loadAllData();
      },
      error: (err) => {
        this.error = `Erreur lors de la création du tableau de score: ${err.message}`;
        this.showMessage(this.error);
        this.loading = false;
      }
    });
  }
}

  editScore(score: any) {
    this.isEditingScore = true;
    this.currentScoreId = score.id;
    
    this.scoreForm.patchValue({
      clubId: score.clubs.id,
      matchsJoues: score.matchsJoues,
      matchsGagnes: score.matchsGagnes,
      matchsNuls: score.matchsNuls,
      matchsPerdus: score.matchsPerdus,
      points: score.points
    });
  }

  deleteScore(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce tableau de score ?')) {
      this.loading = true;
      this.adminService.deleteScore(id).subscribe({
        next: () => {
          this.showMessage('Tableau de score supprimé avec succès');
          this.loadAllData();
        },
        error: (err) => {
          this.error = `Erreur lors de la suppression du tableau de score: ${err.message}`;
          this.showMessage(this.error);
          this.loading = false;
        }
      });
    }
  }

  resetScoreForm() {
    this.scoreForm.reset({
      clubId: '',
      matchsJoues: 0,
      matchsGagnes: 0,
      matchsNuls: 0,
      matchsPerdus: 0,
      points: 0
    });
    this.isEditingScore = false;
    this.currentScoreId = null;
  }

  // Méthodes pour les résultats de matchs
 // Méthodes pour les résultats de matchs
onSubmitMatchResult() {
  if (this.matchResultForm.invalid) {
    this.showMessage('Veuillez remplir correctement tous les champs obligatoires.');
    return;
  }

  // Récupérer les valeurs du formulaire
  const formValues = this.matchResultForm.value;
  
  // Créer l'objet match avec la structure correcte
  const matchData = {
    clubA: { id: formValues.clubAId },
    clubB: { id: formValues.clubBId },
    scoreEquipeA: formValues.scoreEquipeA,
    scoreEquipeB: formValues.scoreEquipeB,
    dateMatch: formValues.dateMatch,
    terrain: { id: formValues.terrainId },
    statutMatch: formValues.statutMatch,
    competition: { id: formValues.competitionId },
    commentaires: formValues.commentaires
  };

  this.loading = true;

  if (this.isEditingMatch && this.currentMatchId) {
    // Mise à jour d'un résultat existant
    this.adminService.updateResultatMatch(this.currentMatchId, matchData).subscribe({
      next: (response) => {
        this.showMessage('Résultat de match mis à jour avec succès');
        this.resetMatchForm();
        this.loadAllData();
      },
      error: (err) => {
        this.error = `Erreur lors de la mise à jour du résultat de match: ${err.message}`;
        this.showMessage(this.error);
        this.loading = false;
      }
    });
  } else {
    // Création d'un nouveau résultat
    this.adminService.createResultatMatch(matchData).subscribe({
      next: (response) => {
        this.showMessage('Résultat de match créé avec succès');
        this.resetMatchForm();
        this.loadAllData();
      },
      error: (err) => {
        this.error = `Erreur lors de la création du résultat de match: ${err.message}`;
        this.showMessage(this.error);
        this.loading = false;
      }
    });
  }
}

  editMatchResult(match: any) {
    this.isEditingMatch = true;
    this.currentMatchId = match.id;
    
    this.matchResultForm.patchValue({
      clubAId: match.clubA.id,
      clubBId: match.clubB.id,
      scoreEquipeA: match.scoreEquipeA,
      scoreEquipeB: match.scoreEquipeB,
      dateMatch: match.dateMatch,
      terrainId: match.terrain.id,
      statutMatch: match.statutMatch,
      competitionId: match.competition.id,
      commentaires: match.commentaires
    });
  }

  deleteMatchResult(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce résultat de match ?')) {
      this.loading = true;
      this.adminService.deleteResultatMatch(id).subscribe({
        next: () => {
          this.showMessage('Résultat de match supprimé avec succès');
          this.loadAllData();
        },
        error: (err) => {
          this.error = `Erreur lors de la suppression du résultat de match: ${err.message}`;
          this.showMessage(this.error);
          this.loading = false;
        }
      });
    }
  }

  resetMatchForm() {
    this.matchResultForm.reset({
      clubAId: '',
      clubBId: '',
      scoreEquipeA: 0,
      scoreEquipeB: 0,
      dateMatch: new Date().toISOString().split('T')[0],
      terrainId: '',
      statutMatch: '',
      competitionId: '',
      commentaires: ''
    });
    this.isEditingMatch = false;
    this.currentMatchId = null;
  }

  // Navigation entre les onglets
  setActiveTab(tab: 'scores' | 'matches' | 'charts') {
    this.activeTab = tab;
    
    // Mettre à jour les graphiques si on passe à l'onglet des graphiques
    if (tab === 'charts') {
      setTimeout(() => {
        this.createPointsChart();
        this.createMatchesChart();
      }, 100);
    }
  }

  // Création des graphiques
  createPointsChart() {
    if (this.pointsChart) {
      this.pointsChart.destroy();
    }

    const canvas = document.getElementById('pointsChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Préparer les données pour le graphique
    const labels = this.tableScores.map(score => score.clubs.nom);
    const points = this.tableScores.map(score => score.points);

    this.pointsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Points par club',
          data: points,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createMatchesChart() {
    if (this.matchesChart) {
      this.matchesChart.destroy();
    }

    const canvas = document.getElementById('matchesChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Préparer les données pour le graphique
    const labels = this.tableScores.map(score => score.clubs.nom);
    const matchesPlayed = this.tableScores.map(score => score.matchsJoues);
    const matchesWon = this.tableScores.map(score => score.matchsGagnes);
    const matchesDrawn = this.tableScores.map(score => score.matchsNuls);
    const matchesLost = this.tableScores.map(score => score.matchsPerdus);

    this.matchesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Matchs joués',
            data: matchesPlayed,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Matchs gagnés',
            data: matchesWon,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Matchs nuls',
            data: matchesDrawn,
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          },
          {
            label: 'Matchs perdus',
            data: matchesLost,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Filtrage des tableaux
  applyScoreFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.scoreFilter = filterValue;
    this.filteredScores = this.tableScores.filter(score => 
      score.clubs.nom.toLowerCase().includes(filterValue)
    );
  }

  applyMatchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.matchFilter = filterValue;
    this.filteredMatches = this.matchResults.filter(match => 
      match.clubA.nom.toLowerCase().includes(filterValue) || 
      match.clubB.nom.toLowerCase().includes(filterValue) ||
      match.competition.nom.toLowerCase().includes(filterValue)
    );
  }

  // Utilitaires
  showMessage(message: string): void {
    // Vous pouvez remplacer ceci par votre propre mécanisme de notification
    alert(message);
  }

  // Méthode pour calculer automatiquement les points
  calculatePoints() {
    const matchsGagnes = this.scoreForm.get('matchsGagnes')?.value || 0;
    const matchsNuls = this.scoreForm.get('matchsNuls')?.value || 0;
    
    // Calcul des points (3 points par victoire, 1 point par match nul)
    const points = (matchsGagnes * 3) + matchsNuls;
    
    this.scoreForm.patchValue({ points });
  }

  // Méthode pour vérifier la cohérence des matchs
  validateMatchesCount() {
    const matchsJoues = this.scoreForm.get('matchsJoues')?.value || 0;
    const matchsGagnes = this.scoreForm.get('matchsGagnes')?.value || 0;
    const matchsNuls = this.scoreForm.get('matchsNuls')?.value || 0;
    const matchsPerdus = this.scoreForm.get('matchsPerdus')?.value || 0;
    
    const totalMatches = matchsGagnes + matchsNuls + matchsPerdus;
    
    if (totalMatches !== matchsJoues) {
      this.showMessage('Attention: Le nombre total de matchs (gagnés + nuls + perdus) ne correspond pas au nombre de matchs joués.');
    }
  }

  // Méthode pour exporter les données en CSV
  exportToCSV(type: 'scores' | 'matches') {
    let data: any[] = [];
    let filename = '';
    let headers = '';

    if (type === 'scores') {
      data = this.tableScores;
      filename = 'tableaux_scores.csv';
      headers = 'Club,Matchs Joués,Matchs Gagnés,Matchs Nuls,Matchs Perdus,Points\n';
    } else {
      data = this.matchResults;
      filename = 'resultats_matchs.csv';
      headers = 'Date,Compétition,Club A,Score A,Score B,Club B,Terrain,Statut\n';
    }

    let csvContent = headers;

    if (type === 'scores') {
      data.forEach(item => {
        const row = [
          item.clubs.nom,
          item.matchsJoues,
          item.matchsGagnes,
          item.matchsNuls,
          item.matchsPerdus,
          item.points
        ].join(',');
        csvContent += row + '\n';
      });
    } else {
      data.forEach(item => {
        const row = [
          new Date(item.dateMatch).toLocaleDateString(),
          item.competition.nom,
          item.clubA.nom,
          item.scoreEquipeA,
          item.scoreEquipeB,
          item.clubB.nom,
          item.terrain.nom,
          item.statutMatch
        ].join(',');
        csvContent += row + '\n';
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Méthodes utilitaires pour le template
  getStatusClass(status: string): string {
    switch (status) {
      case 'Reporté':
        return 'status-programme';
      case 'EN_Cours':
        return 'status-en_cours';
      case 'Terminé':
        return 'status-termine';
      case 'Annulé':
        return 'status-annule';
      default:
        return '';
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}