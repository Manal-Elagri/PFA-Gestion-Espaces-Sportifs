import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { ResponsableService } from 'src/app/services/responsable.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  submitted = false;
  loading = false;
  message = '';
  success = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private responsableService: ResponsableService
  ) {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }
  
  ngOnInit(): void {
    // Récupérer le token depuis l'URL
    this.token = this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.message = "Lien de réinitialisation invalide";
      this.success = false;
    }
  }
  
  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  
  onSubmit() {
    this.submitted = true;
      
    if (this.resetForm.invalid) {
      return;
    }
      
    this.loading = true;
      
    this.http.post(`${this.responsableService.getBaseUrl()}/compte-responsable/reset-password`, {
      token: this.token,
      password: this.resetForm.get('password')?.value
    }, { responseType: 'text' })  // Précisez que vous attendez une réponse textuelle
    .pipe(first())
    .subscribe({
      next: (response: any) => {
        this.loading = false;
        this.success = true;
        this.message = response || "Votre mot de passe a été réinitialisé avec succès.";
              
        // Rediriger vers la page de connexion après quelques secondes
        setTimeout(() => {
          this.router.navigate(['/compte-responsable/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.success = false;
        
        console.error('Erreur détaillée:', error);
        
        // Gérer différents types d'erreurs
        if (error.error && typeof error.error === 'string') {
          this.message = error.error;
        } else if (typeof error.error === 'object' && error.error !== null) {
          // Convertir l'objet en chaîne JSON pour l'affichage de débogage
          this.message = JSON.stringify(error.error);
        } else if (error.message) {
          this.message = error.message;
        } else {
          this.message = "Erreur lors de la réinitialisation du mot de passe.";
        }
      }
    });
  }
}