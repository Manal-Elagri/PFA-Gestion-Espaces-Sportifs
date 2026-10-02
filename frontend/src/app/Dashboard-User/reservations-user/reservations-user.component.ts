import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationTerrainService } from '../../services/reservation-terrain';
import { ReservationTerrain, Terrain, EtatReservationTerrain, Equipe, CategorieTerrain } from '../../services/models-terrain-reservation';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservations-user',
  templateUrl: './reservations-user.component.html',
  styleUrls: ['./reservations-user.component.css']
})
export class ReservationsUserComponent implements OnInit {
  // Tableaux pour stocker les données
  mesEquipes: Equipe[] = [];
  terrainsDisponibles: Terrain[] = [];
  mesReservations: ReservationTerrain[] = [];
  selectedTerrain: Terrain | null = null;
  // Variables d'état
  isLoading = false;
  equipesChargees = false;
  terrainsCharges = false;
  reservationsChargees = false;
  
  // Formulaire de réservation
  reservationForm: FormGroup;
  
  // Dates pour le calendrier
  minDate: Date = new Date();
 
  
  // Définir les états de réservation pour l'affichage
  etatReservationTerrain = EtatReservationTerrain;
  categorieTerrain = CategorieTerrain;
  
  constructor(
    private reservationService: ReservationTerrainService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // Initialiser le formulaire avec la date du calendrier
    this.reservationForm = this.fb.group({
      equipeId: ['', Validators.required],
      terrainId: ['', Validators.required],
      dateCalendrier: [new Date(), Validators.required] // Ajout du champ date
    });
  }

  ngOnInit(): void {
    this.chargerMesEquipes();
    this.chargerTerrainsDisponibles();
    this.chargerMesReservations();
    this.generateSimpleCalendar();
  }

  // Charger les équipes du responsable
  chargerMesEquipes(): void {
    this.isLoading = true;
    this.equipesChargees = false;
    
    this.reservationService.getMesEquipes().subscribe({
      next: (data) => {
        this.mesEquipes = data;
        this.equipesChargees = true;
        this.isLoading = !(this.terrainsCharges && this.reservationsChargees);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des équipes:', error);
        this.snackBar.open('Erreur lors du chargement des équipes', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.equipesChargees = true;
        this.isLoading = !(this.terrainsCharges && this.reservationsChargees);
      }
    });
  }

  // Charger les terrains disponibles
  chargerTerrainsDisponibles(): void {
    this.isLoading = true;
    this.terrainsCharges = false;
    
    this.reservationService.getTerrainsDisponibles().subscribe({
      next: (terrains) => {
        this.terrainsDisponibles = terrains;
        this.terrainsCharges = true;
        this.isLoading = !(this.equipesChargees && this.reservationsChargees);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des terrains:', error);
        this.snackBar.open('Erreur lors du chargement des terrains disponibles', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.terrainsCharges = true;
        this.isLoading = !(this.equipesChargees && this.reservationsChargees);
      }
    });
  }

  // Vérifier la disponibilité du terrain à la date sélectionnée
  verifierDisponibiliteTerrain(): void {
    const terrainId = this.reservationForm.value.terrainId;
    const dateCalendrier = this.reservationForm.value.dateCalendrier;
    
    if (!terrainId || !dateCalendrier) return;
    
    this.isLoading = true;
    this.reservationService.isTerrainDisponible(terrainId, dateCalendrier).subscribe({
      next: (response) => {
        if (!response.disponible) {
          this.snackBar.open('Ce terrain n\'est pas disponible à cette date', 'Fermer', {
            duration: 3000,
            panelClass: ['warning-snackbar']
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la vérification de la disponibilité:', error);
        this.isLoading = false;
      }
    });
  }

  // Charger toutes les réservations
 // Dans reservations-user.component.ts
chargerMesReservations(): void {
  this.isLoading = true;
  this.reservationsChargees = false;
  
  this.reservationService.getAllReservations().subscribe({
    next: (reservations) => {
      console.log('Réservations chargées:', reservations); // Vérifiez que l'ID est présent
      this.mesReservations = reservations;
      this.reservationsChargees = true;
      this.isLoading = !(this.equipesChargees && this.terrainsCharges);
    },
    error: (error) => {
      console.error('Erreur lors du chargement des réservations:', error);
      this.snackBar.open('Erreur lors du chargement des réservations', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.reservationsChargees = true;
      this.isLoading = !(this.equipesChargees && this.terrainsCharges);
    }
  });
}

  // Soumettre le formulaire de réservation
  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs requis', 'Fermer', {
        duration: 3000
      });
      return;
    }
  
    const equipeId = this.reservationForm.value.equipeId;
    const terrainId = this.reservationForm.value.terrainId;
    const dateCalendrier = this.reservationForm.value.dateCalendrier;
    
    console.log('Soumission du formulaire avec les valeurs:', {
      equipeId,
      terrainId,
      dateCalendrier
    });
    
    this.isLoading = true;
    this.reservationService.passerReservation(equipeId, terrainId, dateCalendrier).subscribe({
      next: (reservation) => {
        console.log('Réservation créée avec succès:', reservation);
        this.snackBar.open('Réservation créée avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.reservationForm.reset({
          dateCalendrier: new Date() // Réinitialiser avec la date du jour
        });
        this.chargerMesReservations(); 
        this.chargerTerrainsDisponibles(); // Recharger les terrains disponibles après réservation
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la création de la réservation:', error);
        let errorMessage = 'Erreur lors de la création de la réservation';
        
        if (error.message) {
          errorMessage = error.message;
        }
        
        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      },
      complete: () => {
        // Assurer que l'état de chargement est réinitialisé même en cas de problème inattendu
        this.isLoading = false;
      }
    });
  }

 // Dans reservations-user.component.ts
 
reservationsEnCoursAnnulation: Set<number> = new Set();

annulerReservation(reservationId: number): void {
  if (this.reservationsEnCoursAnnulation.has(reservationId)) {
    // Éviter les annulations multiples
    return;
  }
  
  if (confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
    this.isLoading = true;
    this.reservationsEnCoursAnnulation.add(reservationId);
    
    this.reservationService.annulerReservation(reservationId).subscribe({
      next: (response) => {
        this.snackBar.open('Réservation annulée avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.chargerMesReservations();
        this.chargerTerrainsDisponibles();
        this.isLoading = false;
        this.reservationsEnCoursAnnulation.delete(reservationId);
      },
      error: (error) => {
        console.error('Erreur lors de l\'annulation de la réservation:', error);
        
        // Vérifier si l'erreur est due à une réservation déjà supprimée
        if (error.error && error.error.includes('Réservation non trouvée')) {
          this.snackBar.open('Cette réservation a déjà été annulée', 'Fermer', {
            duration: 3000,
            panelClass: ['warning-snackbar']
          });
          // Recharger les données pour mettre à jour l'interface
          this.chargerMesReservations();
        } else {
          this.snackBar.open('Erreur lors de l\'annulation de la réservation', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
        
        this.isLoading = false;
        this.reservationsEnCoursAnnulation.delete(reservationId);
      }
    });
  }
}

  // Formater la date pour l'affichage
  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  // Vérifier si une réservation peut être annulée (seulement si elle est en attente)
  peutAnnuler(reservation: ReservationTerrain): boolean {
    return reservation.etatReservation === EtatReservationTerrain.EN_ATTENTE;
  }

  // Obtenir la classe CSS en fonction de l'état de la réservation
  getStatusClass(etat: EtatReservationTerrain | undefined): string {
    if (!etat) return '';
    
    switch (etat) {
      case EtatReservationTerrain.VALIDEE:
        return 'status-confirmed';
      case EtatReservationTerrain.EN_ATTENTE:
        return 'status-pending';
      case EtatReservationTerrain.REFUSEE:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  // Récupérer les réservations d'une équipe spécifique
  getEquipeReservations(equipeId: number): ReservationTerrain[] {
    return this.mesReservations.filter(r => r.equipe.id === equipeId);
  }

  // Calculer le nombre total de réservations
  getTotalReservations(): number {
    return this.mesReservations.length;
  }

  // Calculer le nombre de réservations par statut
  getReservationsByStatus(statut: EtatReservationTerrain): number {
    return this.mesReservations.filter(r => r.etatReservation === statut).length;
  }

  // Obtenir l'icône pour la catégorie de terrain
  
  // Afficher la date d'utilisation prévue (calendrier)
  formatCalendrierDate(date: Date | string | undefined): string {
    if (!date) return 'Date non planifiée';
    const calDate = new Date(date);
    return calDate.toLocaleDateString();
  }




onDateSelected(date: Date): void {
  console.log('Date sélectionnée:', date); // Pour déboguer
  this.reservationForm.patchValue({
    dateCalendrier: date
  });
  this.verifierDisponibiliteTerrain();
}


// Propriétés pour le calendrier simplifié
calendarDays: Date[] = [];
currentMonth: Date = new Date();
selectedDate: Date | null = null;


// Méthode pour sélectionner une date
selectDate(date: Date): void {
  this.selectedDate = date;
  this.reservationForm.patchValue({
    dateCalendrier: date
  });
  this.verifierDisponibiliteTerrain();
}



// Méthode pour vérifier si une date est sélectionnée
isDateSelected(date: Date): boolean {
  if (!this.selectedDate) return false;
  
  return (
    this.selectedDate.getFullYear() === date.getFullYear() &&
    this.selectedDate.getMonth() === date.getMonth() &&
    this.selectedDate.getDate() === date.getDate()
  );
}


// Dans votre composant reservations-user.component.ts

// Ajoutez cette propriété pour stocker les dates non disponibles
datesNonDisponibles: Date[] = [];

// Modifiez la méthode onTerrainSelected pour gérer correctement le type undefined
// Dans votre méthode onTerrainSelected
onTerrainSelected(): void {
  console.log("onTerrainSelected appelé");
  const terrainId = this.reservationForm.get('terrainId')?.value;
  console.log("ID du terrain sélectionné:", terrainId);
  
  if (terrainId) {
    // Trouver le terrain dans la liste des terrains disponibles
    const terrain = this.terrainsDisponibles.find(t => t.id == terrainId);
    // Assigner null si terrain est undefined
    this.selectedTerrain = terrain || null;
    console.log("Terrain sélectionné:", this.selectedTerrain);
    
    // Réinitialiser les dates non disponibles
    this.datesNonDisponibles = [];
    
    // Récupérer les réservations validées pour ce terrain
    this.reservationService.getReservationsValideesParTerrain(terrainId).subscribe(
      (reservations) => {
        console.log("Réservations validées récupérées:", reservations);
        
        // Extraire les dates des réservations validées
        this.datesNonDisponibles = reservations
          .filter(reservation => reservation.etatReservation === 'VALIDEE')
          .map(reservation => {
            console.log("Traitement de la réservation:", reservation);
            
            // Si calendrier est un objet avec une propriété date
            if (typeof reservation.calendrier === 'object' && reservation.calendrier.date) {
              console.log("Date extraite (objet):", reservation.calendrier.date);
              return new Date(reservation.calendrier.date);
            }
            // Si calendrier est directement une date
            else if (reservation.calendrier) {
              console.log("Date extraite (string):", reservation.calendrier);
              return new Date(reservation.calendrier);
            }
            return null;
          })
          .filter(date => date !== null) as Date[];
        
        // Normaliser les dates (enlever l'heure)
        this.datesNonDisponibles = this.datesNonDisponibles.map(date => {
          const newDate = new Date(date);
          newDate.setHours(0, 0, 0, 0);
          return newDate;
        });
        
        console.log("Dates non disponibles après traitement:", 
          this.datesNonDisponibles.map(d => d.toISOString().split('T')[0]));
        
        // Générer le calendrier
        this.generateSimpleCalendar();
      },
      (error) => {
        console.error("Erreur lors de la récupération des réservations validées:", error);
        // Générer le calendrier même en cas d'erreur
        this.generateSimpleCalendar();
      }
    );
  } else {
    this.selectedTerrain = null;
  }
}
// Modifiez la méthode isDateAvailable pour prendre en compte les dates non disponibles
// Dans votre méthode isDateAvailable
isDateAvailable(date: Date): boolean {
  // Vérifier si la date est dans le passé
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Déboguer les dates
  console.log("Vérification de disponibilité pour:", date.toISOString().split('T')[0]);
  console.log("Dates non disponibles:", this.datesNonDisponibles.map(d => d.toISOString().split('T')[0]));
  
  // Vérifier si la date est déjà réservée (en comparant uniquement les dates sans l'heure)
  const estDejaReservee = this.datesNonDisponibles.some(dateReservee => {
    // Normaliser les dates pour comparer uniquement jour/mois/année
    const dateStr = date.toISOString().split('T')[0];
    const reserveeStr = dateReservee.toISOString().split('T')[0];
    
    console.log(`Comparaison: ${dateStr} === ${reserveeStr}`);
    return dateStr === reserveeStr;
  });
  
  return date >= today && !estDejaReservee;
}

// Dans votre composant

// Méthode pour changer de mois
changeMonth(delta: number): void {
  const newMonth = new Date(this.currentMonth);
  newMonth.setMonth(newMonth.getMonth() + delta);
  this.currentMonth = newMonth;
  this.generateSimpleCalendar();
}

// Modifiez la méthode generateSimpleCalendar pour afficher correctement le mois
generateSimpleCalendar(): void {
  console.log("Génération du calendrier pour", this.currentMonth);
  this.calendarDays = [];
  
  const year = this.currentMonth.getFullYear();
  const month = this.currentMonth.getMonth();
  
  // Premier jour du mois
  const firstDay = new Date(year, month, 1);
  // Jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
  const firstDayOfWeek = firstDay.getDay();
  
  // Ajouter les jours du mois précédent pour compléter la première semaine
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    this.calendarDays.push(new Date(year, month - 1, prevMonthLastDay - i));
  }
  
  // Ajouter les jours du mois actuel
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    this.calendarDays.push(new Date(year, month, i));
  }
  
  // Ajouter les jours du mois suivant pour compléter la dernière semaine
  const lastDayOfWeek = new Date(year, month, lastDay).getDay();
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    this.calendarDays.push(new Date(year, month + 1, i));
  }
  
  console.log("Jours du calendrier:", this.calendarDays);
}












 // Méthode pour obtenir l'icône du terrain selon sa catégorie
  getCategorieIcon(categorie: string): string {
    switch (categorie.toLowerCase()) {
      case 'football':
        return '⚽'; // Emoji ballon de football
      case 'basketball':
        return '🏀'; // Emoji ballon de basketball
      case 'tennis':
        return '🎾'; // Emoji balle de tennis
      case 'volleyball':
        return '🏐'; // Emoji ballon de volleyball
      case 'rugby':
        return '🏉'; // Emoji ballon de rugby
      case 'hockey':
        return '🏑'; // Emoji hockey
      default:
        return '🏟️'; // Emoji stade par défaut
    }
  }

  // Méthode pour obtenir l'icône pour les équipes
  getEquipeIcon(): string {
    return '👥';
  }

  // Méthode pour obtenir l'icône pour les dates de réservation
  getDateReservationIcon(): string {
    return '📅';
  }

  // Méthode pour obtenir l'icône pour les dates d'utilisation
  getDateUtilisationIcon(): string {
    return '📆';
  }

  // Méthode pour obtenir l'icône d'annulation
  getAnnulerIcon(): string {
    return '❌';
  }



}