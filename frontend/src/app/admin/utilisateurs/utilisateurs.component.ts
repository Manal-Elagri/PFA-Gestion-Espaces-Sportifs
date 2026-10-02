import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandeCreationService } from '../../services/demande-creation.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent implements OnInit {
   // Données de demandes
   demandes: any[] = [];
   totalDemandes: number = 0;
   totalClub: number = 0;
   totalEquipe: number = 0;
   
   // Données des clubs et équipes
   clubs: any[] = [];
   equipes: any[] = [];
   totalClubsApprouves: number = 0;
   totalEquipesApprouvees: number = 0;
   
   // États
   loading: boolean = false;
   errorMessage: string = '';
   successMessage: string = '';
   activeTab: 'demandes' | 'clubs' | 'equipes' = 'demandes';
   
   // Pour gérer le dialogue de commentaire
   selectedDemandeId: number | null = null;
   commentaireForm: FormGroup;
   modalAction: 'approuver' | 'refuser' | null = null;
   
   constructor(
     private demandeService: DemandeCreationService,
     private adminService: AdminService,
     private fb: FormBuilder
   ) {
     this.commentaireForm = this.fb.group({
       commentaire: ['', Validators.required]
     });
   }
 
   ngOnInit(): void {
     this.loadDemandesEnAttente();
     this.loadClubs();
     this.loadEquipes();
   }
 
   loadDemandesEnAttente(): void {
     this.loading = true;
     this.demandeService.getDemandesEnAttente().subscribe({
       next: (data) => {
         this.demandes = data;
         this.totalDemandes = data.length;
         this.calculerStatistiques();
         this.loading = false;
       },
       error: (error) => {
         console.error('Erreur lors du chargement des demandes:', error);
         this.errorMessage = 'Impossible de charger les demandes. Veuillez réessayer.';
         this.loading = false;
       }
     });
   }
   
   loadClubs(): void {
     this.loading = true;
     this.adminService.getAllClubs().subscribe({
       next: (data) => {
         this.clubs = data;
         this.totalClubsApprouves = data.length;
         this.loading = false;
       },
       error: (error) => {
         console.error('Erreur lors du chargement des clubs:', error);
         this.errorMessage = 'Impossible de charger les clubs. Veuillez réessayer.';
         this.loading = false;
       }
     });
   }
   
   loadEquipes(): void {
     this.loading = true;
     this.adminService.getAllEquipes().subscribe({
       next: (data) => {
         this.equipes = data;
         this.totalEquipesApprouvees = data.length;
         this.loading = false;
       },
       error: (error) => {
         console.error('Erreur lors du chargement des équipes:', error);
         this.errorMessage = 'Impossible de charger les équipes. Veuillez réessayer.';
         this.loading = false;
       }
     });
   }
 
   calculerStatistiques(): void {
     this.totalClub = this.demandes.filter(d => d.typeDemande === 'CLUB').length;
     this.totalEquipe = this.demandes.filter(d => d.typeDemande === 'EQUIPE').length;
   }
 
   // Ouvrir le modal pour approuver/refuser
   openModal(demande: any, action: 'approuver' | 'refuser'): void {
     this.selectedDemandeId = demande.id;
     this.modalAction = action;
     this.commentaireForm.reset();
   }
 
   // Fermer le modal
   closeModal(): void {
     this.selectedDemandeId = null;
     this.modalAction = null;
   }
 
   // Soumettre le formulaire de commentaire
   submitAction(): void {
     if (this.commentaireForm.invalid || !this.selectedDemandeId || !this.modalAction) {
       return;
     }
 
     const commentaire = this.commentaireForm.value.commentaire;
     this.loading = true;
 
     if (this.modalAction === 'approuver') {
       this.demandeService.approuverDemande(this.selectedDemandeId, commentaire).subscribe({
         next: () => {
           this.handleActionSuccess('La demande a été approuvée avec succès');
         },
         error: (error) => this.handleActionError(error)
       });
     } else {
       this.demandeService.refuserDemande(this.selectedDemandeId, commentaire).subscribe({
         next: () => {
           this.handleActionSuccess('La demande a été refusée');
         },
         error: (error) => this.handleActionError(error)
       });
     }
   }
 
   private handleActionSuccess(message: string): void {
     this.successMessage = message;
     setTimeout(() => this.successMessage = '', 5000);
     this.closeModal();
     this.loadDemandesEnAttente(); // Recharger les demandes
     this.loadClubs(); // Recharger les clubs
     this.loadEquipes(); // Recharger les équipes
     this.loading = false;
   }
   
   // Changer d'onglet
   changeTab(tab: 'demandes' | 'clubs' | 'equipes'): void {
     this.activeTab = tab;
   }
 
   private handleActionError(error: any): void {
     console.error('Erreur lors du traitement de la demande:', error);
     this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
     setTimeout(() => this.errorMessage = '', 5000);
     this.closeModal();
     this.loading = false;
   }
 
   // Retourne la classe CSS selon l'état de la demande
   getStatusClass(etat: string): string {
     switch (etat) {
       case 'EN_ATTENTE': return 'status-pending';
       case 'APPROUVEE': return 'status-approved';
       case 'REFUSEE': return 'status-rejected';
       default: return '';
     }
   }
 
   // Formatage de la date pour l'affichage
   formatDate(date: string): string {
     if (!date) return '-';
     return new Date(date).toLocaleDateString('fr-FR', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit'
     });
   }
 }