import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponsableService } from '../services/responsable.service';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';
  successMessage: string | undefined; // Ajoute cette variable
  submitted = false; // Added this to track form submission

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private responsableService: ResponsableService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nom_responsable: ['', Validators.required],
      prenom_responsable: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      filière: ['', Validators.required], // Changed from Filière to filiere for consistency
      type: ['etudiant', Validators.required], // Ajoute cette ligne pour le champ caché
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });
  }

  // Removed the get f() accessor that was causing issues

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);
      
      if (!control || !matchingControl) {
        return;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  
  onSubmit() {
    this.submitted = true; // Mark as submitted to show validation errors


     // Réinitialisation des messages avant la soumission
    this.successMessage = '';
    this.error = '';



    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    const studentData = {
      ...this.registerForm.value,
   type: 'etudiant' // <-- et non CompteEtudiantResponsable
  };
    
    delete studentData.confirmPassword;

    this.responsableService.registerResponsable(studentData)
      .subscribe({
        next: () => {
          this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
          setTimeout(() => {
            this.router.navigate(['/compte-responsable/login']);
          }, 3000); // Redirection après 3 secondes
        },
        error: (error) => {
          // Si l'erreur est un objet, essayer d'extraire le message spécifique
          if (error instanceof Error) {
            this.error = error.message || 'Une erreur est survenue.';
          } else if (typeof error === 'object' && error != null) {
            this.error = error?.message || JSON.stringify(error); // Convertit l'objet en texte si nécessaire
          } else {
            this.error = 'Une erreur inconnue est survenue.';
          }
          this.loading = false;
        }
      });
  }

  redirectToLogin() {
    this.router.navigate(['/compte-responsable/login']);
  }


  closeForm() {
    this.router.navigate(['']);
  }

}