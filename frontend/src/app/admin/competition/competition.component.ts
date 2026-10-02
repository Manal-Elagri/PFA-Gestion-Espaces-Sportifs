import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {

  competitions: any[] = [];
  competitionForm!: FormGroup;
  selectedFile: File | null = null;
  editMode = false;
  editingId: number | null = null;
  typeDeSportList = ['FOOTBALL', 'BASKETBALL', 'VOLLEYBALL', 'TENNIS', 'MULTISPORTS'];
  categorieList = [
  'TOURNOI_Ramadan', 'COUPE_Universitaire', 'LIGUE_InterClubs', 'CHAMPIONNAT_Regional',
  'TOURNOI_Estival', 'LIGUE_Des_Filieres', 'GALA_Sportif', 'JOURNEE_Sportive',
  'OLYMPIADE_Univ', 'TOURNOI_Fin_Annee', 'Competition_interEcole'
];
statutList = ['En_cours', 'À_venir', 'Terminé'];
successMessage: string = '';
errorMessage: string = '';


showForm = false;

toggleForm() {
  this.showForm = !this.showForm;
}


  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {}


  getStatutClass(statut: string): string {
    switch (statut) {
      case 'En cours': return 'badge bg-info';
      case 'Terminée': return 'badge bg-danger';
      case 'À venir': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary';
    }
  }
  

  ngOnInit(): void {
    this.initForm();
    this.loadCompetitions();
  }

  initForm() {
    this.competitionForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      typedesport: ['', Validators.required],
      categorieCompetition: ['', Validators.required],
      etatCompetition: ['En_cours']
    });
  }

  loadCompetitions() {
    this.adminService.getAllCompetitions().subscribe(data => {
      this.competitions = data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.competitionForm.invalid) return;

    const competition = this.competitionForm.value;

    if (this.selectedFile) {
      this.adminService.uploadImage(this.selectedFile).subscribe(res => {
        competition.imageURL = res.imageUrl;
        this.saveCompetition(competition);
        

      });
    } else {
      this.saveCompetition(competition);
    }
  }

  saveCompetition(data: any) {
    if (this.editMode && this.editingId !== null) {
      this.adminService.updateCompetition(this.editingId, data).subscribe(() => {
        this.loadCompetitions();
        this.resetForm();
      
      });
    } else {
      this.adminService.createCompetition(data).subscribe(() => {
        this.loadCompetitions();
        this.resetForm();
        
      });
    }
  }

  editCompetition(comp: any) {
    this.editMode = true;
    this.editingId = comp.id;
    this.competitionForm.patchValue(comp);
    this.showForm = true; 
   

  }

  deleteCompetition(id: number) {
    if (confirm('Voulez-vous supprimer cette compétition ?')) {
      this.adminService.deleteCompetition(id).subscribe(() => {
        this.loadCompetitions();
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.editingId = null;
    this.selectedFile = null;
    this.competitionForm.reset({ etatCompetition: 'En_cours' });
  }
}
