import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandeCreationService } from '../../services/demande-creation.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {
  clubForm: FormGroup;
  demandes: any[] = [];
  totalDemandes: number = 0;
  totalClubsApprouves: number = 0;
  isFormVisible: boolean = false;
  isLoading: boolean = false;
  formSubmitted: boolean = false;
  selectedFile: File | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private demandeService: DemandeCreationService
  ) {
    // Retirez le validateur required de imageURL car il sera rempli après l'upload
    this.clubForm = this.fb.group({
      nom: ['', [Validators.required]],
      etablissement: ['', [Validators.required]],
      imageURL: [''] // Pas de validateur required
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.isLoading = true;
    this.demandeService.getMesDemandes().subscribe({
      next: (data) => {
        // Filtrer seulement les demandes de type CLUB
        this.demandes = data.filter((demande: any) => demande.typeDemande === 'CLUB');
        this.totalDemandes = this.demandes.length;
        this.totalClubsApprouves = this.demandes.filter(
          (d: any) => d.etat === 'APPROUVEE'
        ).length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes', error);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des demandes';
      }
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    if (this.isFormVisible) {
      this.clubForm.reset();
      this.formSubmitted = false;
      this.selectedFile = null;
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
  
    // Vérifier si le formulaire est valide
    if (!this.clubForm.valid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    // Vérifier si un fichier est sélectionné
    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner une image';
      return;
    }
  
    console.log("Formulaire valide, début du processus...");
    this.isLoading = true;
  
    // Étape 1 : uploader l'image
    this.demandeService.uploadImage(this.selectedFile).subscribe({
      next: (uploadResponse) => {
        console.log('Réponse d\'upload complète:', uploadResponse);
        
        // Extraire l'URL de l'image de la réponse
        // Attention: votre backend renvoie 'imageUrl', pas 'url' ou 'imageURL'
        let imageURL;
        if (uploadResponse.imageUrl) {
          imageURL = uploadResponse.imageUrl;
        } else if (uploadResponse.url) {
          imageURL = uploadResponse.url;
        } else if (uploadResponse.imageURL) {
          imageURL = uploadResponse.imageURL;
        } else {
          console.error('Format de réponse d\'upload non reconnu:', uploadResponse);
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de l\'upload de l\'image: format de réponse non reconnu';
          return;
        }
        
        console.log('URL d\'image extraite:', imageURL);
  
        const clubData = {
          nom: this.clubForm.value.nom,
          etablissement: this.clubForm.value.etablissement,
          imageURL: imageURL
        };
        
        console.log('Données du club à envoyer:', clubData);
  
        // Étape 2 : créer la demande
        this.demandeService.creerDemandeClub(clubData).subscribe({
          next: (response) => {
            console.log('Demande de club créée avec succès', response);
            this.isLoading = false;
            this.isFormVisible = false;
            this.loadDemandes();
          },
          error: (error) => {
            console.error('Erreur lors de la création de la demande', error);
            this.isLoading = false;
            this.errorMessage = 'Erreur lors de la création de la demande: ' + 
              (error.error && typeof error.error === 'string' ? error.error : 'Erreur inconnue');
          }
        });
      },
      error: (uploadError) => {
        console.error('Erreur lors de l\'upload de l\'image', uploadError);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de l\'upload de l\'image';
      }
    });
  }
  
  // Méthode pour filtrer les demandes approuvées (remplace le pipe filter)
  getApprovedDemandes(): any[] {
    return this.demandes.filter(demande => demande.etat === 'APPROUVEE');
  }

  getStatusClass(etat: string): string {
    switch (etat) {
      case 'APPROUVEE':
        return 'status-approved';
      case 'REFUSEE':
        return 'status-refused';
      case 'EN_ATTENTE':
      default:
        return 'status-pending';
    }
  }

  getStatusText(etat: string): string {
    switch (etat) {
      case 'APPROUVEE':
        return 'Approuvée';
      case 'REFUSEE':
        return 'Refusée';
      case 'EN_ATTENTE':
      default:
        return 'En attente';
    }
  }
}