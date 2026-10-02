import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReservationTerrainService } from '../../services/reservation-terrain';
import { Terrain } from '../../services/models-terrain-reservation';

@Component({
  selector: 'app-terrain-calendar',
  templateUrl: './terrain-calendar.component.html',
  styleUrls: ['./terrain-calendar.component.css']
})
export class TerrainCalendarComponent implements OnInit {
  @Input() selectedTerrain: Terrain | null = null;
  @Output() dateSelected = new EventEmitter<Date>();
  
  currentMonth: Date = new Date();
  calendarDays: Array<{
    date: Date,
    isCurrentMonth: boolean,
    isAvailable: boolean,
    isSelected: boolean
  }> = [];
  
  weekdays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  occupiedDates: Date[] = [];
  selectedDate: Date | null = null;
  isLoading = false;
  
  constructor(private reservationService: ReservationTerrainService) {}
  
  ngOnInit(): void {
    this.generateCalendar();
  }
  
  ngOnChanges(): void {
    if (this.selectedTerrain) {
      this.loadOccupiedDates();
    }
  }
  
  loadOccupiedDates(): void {
    if (!this.selectedTerrain) return;
    
    this.isLoading = true;
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth() + 1;
    
    this.reservationService.getReservationsValideesParTerrainEtMois(
      this.selectedTerrain.id, 
      year, 
      month
    ).subscribe({
      next: (reservations) => {
        // Convertir les dates de réservation en objets Date
        this.occupiedDates = reservations.map(r => new Date(r.calendrier));
        this.generateCalendar();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des dates occupées:', error);
        this.isLoading = false;
      }
    });
  }
  
  generateCalendar(): void {
    this.calendarDays = [];
    
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Jours du mois précédent pour compléter la première semaine
    const daysFromPrevMonth = firstDay.getDay();
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isAvailable: this.isDateAvailable(date),
        isSelected: this.isDateSelected(date)
      });
    }
    
    // Jours du mois courant
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      this.calendarDays.push({
        date,
        isCurrentMonth: true,
        isAvailable: this.isDateAvailable(date),
        isSelected: this.isDateSelected(date)
      });
    }
    
    // Jours du mois suivant pour compléter la dernière semaine
    const daysFromNextMonth = 6 - lastDay.getDay();
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isAvailable: this.isDateAvailable(date),
        isSelected: this.isDateSelected(date)
      });
    }
  }
  datesNonDisponibles: Date[] = [];
  
  isDateAvailable(date: Date): boolean {
    // Vérifier si la date est dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Vérifier si la date est déjà réservée
    const estDejaReservee = this.datesNonDisponibles.some(dateReservee => 
      dateReservee.getFullYear() === date.getFullYear() &&
      dateReservee.getMonth() === date.getMonth() &&
      dateReservee.getDate() === date.getDate()
    );
    
    return date >= today && !estDejaReservee;
  }
  
  isDateSelected(date: Date): boolean {
    if (!this.selectedDate) return false;
    
    return (
      this.selectedDate.getFullYear() === date.getFullYear() &&
      this.selectedDate.getMonth() === date.getMonth() &&
      this.selectedDate.getDate() === date.getDate()
    );
  }
  
  selectDate(date: Date): void {
    if (!this.isDateAvailable(date)) return;
    
    this.selectedDate = date;
    this.dateSelected.emit(date);
    this.generateCalendar(); // Mettre à jour l'affichage
  }
  
  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.loadOccupiedDates();
  }
  
  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.loadOccupiedDates();
  }
  
  formatMonthYear(): string {
    return this.currentMonth.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  }
}