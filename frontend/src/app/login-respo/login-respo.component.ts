import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { ResponsableService } from 'src/app/services/responsable.service';

@Component({
  selector: 'app-login-respo',
  templateUrl: './login-respo.component.html',
  styleUrls: ['./login-respo.component.css']
})
export class LoginRespoComponent implements OnInit {
  loginForm: FormGroup;
  loginData = {
    email: '',
    password: ''
  };
  errorMessage = '';
  
  // Propriétés pour le mot de passe oublié
  forgotPasswordForm: FormGroup;
  forgotPasswordSubmitted = false;
  forgotPasswordLoading = false;
  forgotPasswordMessage = '';
  forgotPasswordSuccess = false;
  
  constructor(
    private responsableService: ResponsableService,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    // Initialisation des formulaires
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  ngOnInit(): void {
    // Si vous avez du code dans ngOnInit
  }
  
  login() {
    this.responsableService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (res) => {
        if (this.responsableService.isLoggedIn()) {
          this.router.navigate(['/dashboard-user/dashboardus']);
        } else {
          this.errorMessage = 'Échec de la connexion. Vérifiez vos identifiants.';
        }
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
        this.errorMessage = 'Erreur lors de la connexion.';
      }
    });
  }
  
  // Méthode pour afficher le modal
  showForgotPasswordForm() {
    // Utilisez Bootstrap pour afficher le modal
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
      // Si vous utilisez Bootstrap 5 avec TypeScript
      const bootstrapModal = new (window as any)['bootstrap'].Modal(modal);
      bootstrapModal.show();
    }
  }
  
  // Soumission du formulaire de mot de passe oublié
  onForgotPasswordSubmit() {
    this.forgotPasswordSubmitted = true;
      
    // Arrêt si le formulaire est invalide
    if (this.forgotPasswordForm.invalid) {
      return;
    }
      
    this.forgotPasswordLoading = true;
    this.forgotPasswordMessage = '';
      
    this.http.post(`${this.responsableService.getBaseUrl()}/compte-responsable/forgot-password`, {
      email: this.forgotPasswordForm.get('email')?.value
    }, { responseType: 'text' }) // Spécifier que la réponse est du texte
    .pipe(first())
    .subscribe({
      next: (response: string) => {
        this.forgotPasswordLoading = false;
        this.forgotPasswordSuccess = true;
        this.forgotPasswordMessage = response;
      },
      error: (error) => {
        this.forgotPasswordLoading = false;
        this.forgotPasswordSuccess = false;
          
        console.error('Erreur détaillée:', error);
          
        if (error.status === 404) {
          this.forgotPasswordMessage = "Cet email n'est pas associé à un compte";
        } else if (error.error && typeof error.error === 'string') {
          this.forgotPasswordMessage = error.error;
        } else if (typeof error.error === 'object' && error.error !== null) {
          // Pour des fins de débogage, afficher l'objet d'erreur
          console.log('Objet d\'erreur:', error.error);
          this.forgotPasswordMessage = "Une erreur s'est produite lors de la demande de réinitialisation";
        } else {
          this.forgotPasswordMessage = "Une erreur s'est produite lors de la demande de réinitialisation";
        }
      }
    });
  }


  closeForm() {
    this.router.navigate(['']);
  }
}