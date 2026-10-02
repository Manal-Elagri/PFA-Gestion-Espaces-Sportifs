import { Component, OnInit } from '@angular/core';
import { ReservationTerrainService } from '../../services/reservation-terrain';
import { ReservationTerrain, EtatReservationTerrain, Equipe, Terrain } from '../../services/models-terrain-reservation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  // Listes de réservations
  reservationsEnAttente: ReservationTerrain[] = [];
  reservationsValidees: ReservationTerrain[] = [];
  allReservations: ReservationTerrain[] = [];
  reservationsAnciennesEnAttente: ReservationTerrain[] = [];
  selectedReservation: ReservationTerrain | null = null;
  reservationsParEquipe: ReservationTerrain[] = [];

  // Options de filtrage
  equipes: Equipe[] = [];
  equipeFilter = new FormControl('');
  statusFilter = new FormControl('');
  dateFilter = new FormControl('');
  
  // Vue active
  activeView: 'all' | 'pending' | 'approved' | 'stats' | 'notifications' | 'equipe' = 'all';
  
  // Statistiques
  dashboardStats: any = {
    totalReservations: 0,
    reservationsEnAttente: 0,
    reservationsValidees: 0,
    reservationsParTerrain: {}
  };
  
  // Pour les graphiques
  terrainChartData: any[] = [];
  statusChartData: any[] = [];
  
  // Chargement
  loading = false;
  
  constructor(
    private reservationService: ReservationTerrainService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAllData();

    // Écoute des changements de filtre
    this.equipeFilter.valueChanges.subscribe(() => this.filterReservations());
    this.statusFilter.valueChanges.subscribe(() => this.filterReservations());
    this.dateFilter.valueChanges.subscribe(() => this.filterReservations());
    // Recharger les données toutes les 5 minutes
    setInterval(() => this.loadAllData(), 300000);
  }

  loadAllData(): void {
    this.loading = true;
    Promise.all([
      this.loadReservations(),
      this.loadStats(),
      this.loadEquipes(),
      this.loadNotifications()
    ]).finally(() => {
      this.loading = false;
    });
  }

  loadReservations(): Promise<void> {
    return new Promise((resolve) => {
      this.reservationService.getAllReservationsAdmin().subscribe({
        next: (data) => {
          this.allReservations = data;
          this.filterReservations();
          resolve();
        },
        error: (err) => {
          this.showMessage('Erreur lors du chargement des réservations: ' + err.message);
          resolve();
        }
      });
    });
  }

  loadPendingReservations(): void {
    this.reservationService.getReservationsEnAttente().subscribe({
      next: (data) => {
        this.reservationsEnAttente = data;
      },
      error: (err) => {
        this.showMessage('Erreur lors du chargement des réservations en attente: ' + err.message);
      }
    });
  }

  loadApprovedReservations(): void {
    this.reservationService.getReservationsValidees().subscribe({
      next: (data) => {
        this.reservationsValidees = data;
      },
      error: (err) => {
        this.showMessage('Erreur lors du chargement des réservations validées: ' + err.message);
      }
    });
  }

  loadNotifications(): Promise<void> {
    return new Promise((resolve) => {
      // Réservations en attente depuis plus de 24h
      this.reservationService.getReservationsEnAttenteDepuis(24).subscribe({
        next: (data) => {
          this.reservationsAnciennesEnAttente = data;
          resolve();
        },
        error: (err) => {
          this.showMessage('Erreur lors du chargement des notifications: ' + err.message);
          resolve();
        }
      });
    });
  }

  loadStats(): Promise<void> {
    return new Promise((resolve) => {
      this.reservationService.getDashboardStats().subscribe({
        next: (data) => {
          this.dashboardStats = data;
          this.prepareChartData();
          resolve();
        },
        error: (err) => {
          this.showMessage('Erreur lors du chargement des statistiques: ' + err.message);
          resolve();
        }
      });
    });
  }

  loadEquipes(): Promise<void> {
    return new Promise((resolve) => {
      this.reservationService.getMesEquipes().subscribe({
        next: (data) => {
          this.equipes = data;
          resolve();
        },
        error: (err) => {
          this.showMessage('Erreur lors du chargement des équipes: ' + err.message);
          resolve();
        }
      });
    });
  }

  loadReservationsParEquipe(equipeId: number): void {
    this.loading = true;
    this.reservationService.getReservationsParEquipe(equipeId).subscribe({
      next: (data) => {
        this.reservationsParEquipe = data;
        this.activeView = 'equipe';
        this.loading = false;
      },
      error: (err) => {
        this.showMessage('Erreur lors du chargement des réservations par équipe: ' + err.message);
        this.loading = false;
      }
    });
  }

  changeEtatReservation(reservation: ReservationTerrain, newStatus: string): void {
    // Convertir la chaîne en enum
    const status = newStatus as EtatReservationTerrain;
    
    this.loading = true;
    this.reservationService.changeEtatReservation(reservation.id, status).subscribe({
      next: () => {
        // Mettre à jour l'état de la réservation localement
        reservation.etatReservation = status;
        
        // Feedback à l'utilisateur
        const statusText = this.getStatusText(status);
        this.showMessage(`Réservation ${reservation.id} mise à jour: ${statusText}`);
        
        // Recharger les données pour mettre à jour les statistiques
        this.loadStats();
        this.loading = false;
      },
      error: (err) => {
        this.showMessage('Erreur lors du changement d\'état: ' + err.message);
        this.loading = false;
      }
    });
  }

  prepareChartData(): void {
    // Préparer les données pour le graphique des terrains
    this.terrainChartData = Object.entries(this.dashboardStats.reservationsParTerrain || {}).map(
      ([terrainId, count]: [string, any]) => ({ 
        name: `Terrain ${terrainId}`, 
        value: count 
      })
    );

    // Préparer les données pour le graphique des statuts
    this.statusChartData = [
      { name: 'En attente', value: this.dashboardStats.reservationsEnAttente || 0 },
      { name: 'Validées', value: this.dashboardStats.reservationsValidees || 0 }
    ];
  }

  filterReservations(): void {
    // Implémenter la logique de filtrage basée sur equipeFilter, statusFilter et dateFilter
    // Pour l'instant, nous chargeons simplement toutes les réservations
    this.loadPendingReservations();
    this.loadApprovedReservations();
  }
    
    

  setActiveView(view: 'all' | 'pending' | 'approved' | 'stats' | 'notifications' | 'equipe'): void {
    this.activeView = view;
    
    if (view === 'pending') {
      this.loadPendingReservations();
    } else if (view === 'approved') {
      this.loadApprovedReservations();
    } else if (view === 'stats') {
      this.loadStats();
    } else if (view === 'notifications') {
      this.loadNotifications();
    } else if (view === 'all') {
      this.loadReservations();
    }
  }

  selectReservation(reservation: ReservationTerrain): void {
    this.selectedReservation = reservation;
  }

  getStatusText(status: EtatReservationTerrain): string {
    switch (status) {
      case EtatReservationTerrain.EN_ATTENTE:
        return 'En attente';
      case EtatReservationTerrain.VALIDEE:
        return 'Validée';
      case EtatReservationTerrain.REFUSEE:
        return 'Refusée'; // Corrigé de REFUSEE à Refusée
      default:
        return 'Inconnu';
    }
  }

  getStatusClass(status: EtatReservationTerrain): string {
    switch (status) {
      case EtatReservationTerrain.EN_ATTENTE:
        return 'status-pending';
      case EtatReservationTerrain.VALIDEE:
        return 'status-approved';
      case EtatReservationTerrain.REFUSEE:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return 'Non défini';
    return new Date(date).toLocaleString();
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}