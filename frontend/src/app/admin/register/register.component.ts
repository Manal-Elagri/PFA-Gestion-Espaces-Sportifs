import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service'; // adapte selon ton chemin

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  admin = {
    nom: '',
    email: '',
    password: ''
  };

  constructor(private adminService: AdminService, private router: Router) {}

  register() {
    this.adminService.register(this.admin).subscribe({
      next: (res) => {
        console.log('Inscription réussie:', res);
        alert('Inscription réussie !');
        this.router.navigate(['/admin/login']);
      },
      error: (err) => {
        console.error('Erreur d’inscription:', err);
        alert('Erreur lors de l’inscription.');
      }
    });
  }
}
