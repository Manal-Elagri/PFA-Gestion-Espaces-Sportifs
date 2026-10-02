import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Importation de HttpClient
import { Observable } from 'rxjs';  // Importation de l'Observable

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080'; // URL de votre backend Spring Boot

  constructor(private http: HttpClient) { }

}
