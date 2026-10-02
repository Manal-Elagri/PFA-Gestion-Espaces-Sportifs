// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  errorMessage = '';

  constructor(private adminService: AdminService, private router: Router) {}

  

  login() {
    this.adminService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (res) => {
        if (this.adminService.isLoggedIn()) {
          this.router.navigate(['/admin/dashboard']);
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
}
