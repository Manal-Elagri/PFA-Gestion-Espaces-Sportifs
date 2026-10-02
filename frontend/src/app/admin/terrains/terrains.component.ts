import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-terrain',
  templateUrl: './terrains.component.html',
  styleUrls: ['./terrains.component.css']
})
export class TerrainsComponent implements OnInit {

  terrains: any[] = [];
  terrainForm!: FormGroup;
  selectedFile: File | null = null;
  editMode = false;
  editingId: number | null = null;
  successMessage = '';
  errorMessage = '';
  showForm = false;

  categories: string[] = [
    'ATHLETISME',
    'BASKETBALL',
    'FOOTBALL',
    'HANDBALL',
    'MULTISPORTS',
    'TENNIS',
    'VOLLEYBALL'
  ];

  toggleForm() {
    this.showForm = !this.showForm;
  }

  
  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTerrains();
  }

  initForm() {
    this.terrainForm = this.fb.group({
      nom: ['', Validators.required],
      mesure: ['', Validators.required],
      categorieTerrain: ['', Validators.required],
      estDisponible: [true, Validators.required],
    });
  }
  
  loadTerrains() {
    this.adminService.getAllTerrain().subscribe(data => {
      this.terrains = data;
    });
  }
 
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.terrainForm.invalid) return;
    
    const terrain = this.terrainForm.value;
    
    // Pour le mode édition, conserver l'ancienne image si aucune nouvelle n'est sélectionnée
    if (this.editMode && this.editingId !== null && !this.selectedFile) {
      const oldTerrain = this.terrains.find(t => t.id === this.editingId);
      if (oldTerrain) {
        // Assurez-vous que le nom correspond exactement au backend
        terrain.imageURL = oldTerrain.imageURL;
        this.saveTerrain(terrain);
        return;
      }
    }
    
    // Si un fichier est sélectionné, le télécharger d'abord
    if (this.selectedFile) {
      this.adminService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          terrain.imageURL = res.imageUrl;
          this.saveTerrain(terrain);
        },
        error: (err) => {
          this.errorMessage = "Erreur lors du téléchargement de l'image: " + err.message;
        }
      });
    } else {
      this.saveTerrain(terrain);
    }
  }
  
  saveTerrain(data: any) {
    if (this.editMode && this.editingId !== null) {
      this.adminService.updateTerrain(this.editingId, data).subscribe(() => {
        this.loadTerrains();
        this.resetForm();
      });
    } else {
      this.adminService.createTerrain(data).subscribe(() => {
        this.loadTerrains();
        this.resetForm();
      });
    }
  }

 

  editTerrain(terrain: any) {
    this.editMode = true;
    this.editingId = terrain.id;
    this.terrainForm.patchValue({
      nom: terrain.nom,
      mesure: terrain.mesure,
      categorieTerrain: terrain.categorieTerrain,
      estDisponible: terrain.estDisponible
    });
    
    this.showForm = true;
  }

  deleteTerrain(id: number) {
    if (confirm('Voulez-vous supprimer ce terrain ?')) {
      this.adminService.deleteTerrain(id).subscribe(() => {
        this.loadTerrains();
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.editingId = null;
    this.selectedFile = null;
    this.terrainForm.reset({ estDisponible: true });
    
  }
}
