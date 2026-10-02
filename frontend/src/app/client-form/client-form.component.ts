import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    nom: [''],
    adresse: [''],
    numTelephone: ['']
  });
  
  isLogin: boolean = true;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      nom: [''],
      adresse: [''],
      numTelephone: ['']
    });
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    if (this.isLogin) {
      this.clientForm.get('nom')?.clearValidators();
      this.clientForm.get('adresse')?.clearValidators();
      this.clientForm.get('numTelephone')?.clearValidators();
    } else {
      this.clientForm.get('nom')?.setValidators(Validators.required);
      this.clientForm.get('adresse')?.setValidators(Validators.required);
      this.clientForm.get('numTelephone')?.setValidators(Validators.required);
    }
    this.clientForm.get('nom')?.updateValueAndValidity();
    this.clientForm.get('adresse')?.updateValueAndValidity();
    this.clientForm.get('numTelephone')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.clientForm.valid) {
      if (this.isLogin) {
        // Login
        this.clientService.login({ email: this.clientForm.value.email })
          .subscribe({
            next: (client) => {
              // Stocker les informations du client
              localStorage.setItem('clientId', client.id);
              localStorage.setItem('clientEmail', client.email);
              // Rediriger vers la page de commande
              this.router.navigate(['/commande']);
            },
            error: (error) => {
              console.error('Erreur de connexion:', error);
              // Gérer l'erreur (afficher un message, etc.)
            }
          });
      } else {
        // Register
        this.clientService.register(this.clientForm.value)
          .subscribe({
            next: (client) => {
              localStorage.setItem('clientId', client.id);
              localStorage.setItem('clientEmail', client.email);
              this.router.navigate(['/commande']);
            },
            error: (error) => {
              console.error('Erreur d\'inscription:', error);
              // Gérer l'erreur
            }
          });
      }
    }
  }
}