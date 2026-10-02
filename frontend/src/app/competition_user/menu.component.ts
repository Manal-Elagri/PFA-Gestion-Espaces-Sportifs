import { Component, OnInit } from "@angular/core";
import { AdminService } from "../services/admin.service";
import { Router } from '@angular/router';

@Component({
  selector: "menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["../app.component.css", "./menu.component.css"],
})
export class MenuComponent implements OnInit {
  // Liste de toutes les compétitions
  competitions: any[] = [];
  // Liste des compétitions filtrées selon la catégorie active
  filteredCompetitions: any[] = [];
  // Catégorie active pour le filtre
  activeCategory: string = 'TOUS';
  // Liste des états possibles pour les compétitions
  etatCompetitions: string[] = [
    'En_cours',
    'À_venir',
    'Terminé',
    
  ];
  
  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadCompetitions();
  }
  
  // Récupérer toutes les compétitions depuis le service
  loadCompetitions(): void {
    this.adminService.getAllCompetitions().subscribe({
      next: (data) => {
        this.competitions = data;
        this.filterCompetitions('TOUS');
      },
      error: (error) => {
        console.error('Erreur lors du chargement des compétitions:', error);
      }
    });
  }
  
  // Filtrer les compétitions selon l'état sélectionné
  filterCompetitions(category: string): void {
    this.activeCategory = category;
    
    if (category === 'TOUS') {
      this.filteredCompetitions = [...this.competitions];
    } else {
      this.filteredCompetitions = this.competitions.filter(comp => 
        comp.etatCompetition === category
      );
    }
  }
  
  // Obtenir la classe CSS selon l'état de la compétition
  getStatusClass(status: string): string {
    switch (status) {
      case 'EN_COURS':
        return 'status-active';
      case 'TERMINEE':
        return 'status-completed';
      case 'A_VENIR':
        return 'status-upcoming';
      case 'ANNULEE':
        return 'status-cancelled';
      default:
        return '';
    }
  }
  
 // Propriété pour stocker la compétition sélectionnée
selectedCompetition: any = null;

// Méthode pour afficher les détails d'une compétition
viewDetails(id: number): void {
  // Rechercher la compétition par ID dans votre liste
  this.selectedCompetition = this.filteredCompetitions.find(comp => comp.id === id);
}

// Méthode pour fermer le modal
closeDetails(): void {
  this.selectedCompetition = null;
}


}