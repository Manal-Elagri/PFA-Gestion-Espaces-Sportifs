import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CartItem {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
  imageURL: string;
}

interface CommandeMenuRequest {
  menu: {
    id: number;
  };
  quantite: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:8080/api/clients'; // Base URL for Client API

  constructor(private http: HttpClient) {}

  // Register a new client
  register(client: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, client);
  }

  // Authenticate a client (login)
  login(credentials: { email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, null, {
      params: { email: credentials.email }
    });
  }

  // Get client by ID
  getClientById(clientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${clientId}`);
  }

  // Update a client
  updateClient(clientId: number, clientDetails: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${clientId}`, clientDetails);
  }

 

  // Get all orders of a client
  getClientCommandes(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${clientId}/commandes`);
  }

  // Create a new order for a client
  createCommande(clientId: number, commandeMenuRequests: CommandeMenuRequest[]): Observable<any> {
    console.log('Envoi de la commande:', { clientId, commandeMenuRequests });
    return this.http.post(`${this.baseUrl}/${clientId}/commandes`, commandeMenuRequests)
     
  }



  
}
