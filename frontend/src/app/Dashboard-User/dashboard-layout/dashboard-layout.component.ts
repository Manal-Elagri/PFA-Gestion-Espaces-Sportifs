import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../../services/competition.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
  responsable: any = {
    nom: 'Chargement...',
    niveau: 'Chargement...'
  };
  isLoading = true;
  currentRoute: string = '';

  constructor(
    private competitionService: CompetitionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResponsableInfo();
    
    // Suivre les changements de route pour mettre à jour currentRoute
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });
  }

  loadResponsableInfo(): void {
    this.competitionService.getResponsableInfo().subscribe({
      next: (data) => {
        this.responsable = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des informations du responsable:', error);
        this.responsable = {
          nom: 'Erreur de chargement',
          niveau: 'Inconnu'
        };
        this.isLoading = false;
      }
    });
  }

  // Méthode pour vérifier si un lien est actif
  isActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}