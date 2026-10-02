import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande, MenuQuantite } from '../models/type';

@Injectable({
  providedIn: 'root',
})
export class CommandeService {
  private baseUrl = 'http://localhost:8080/api/commandes';

  constructor(private http: HttpClient) {}

  // Passer une commande
  createCommande(clientId: number, items: MenuQuantite[]): Observable<Commande> {
    return this.http.post<Commande>(`${this.baseUrl}/passer?clientId=${clientId}`, items);
  }

  // Lister les commandes d'un client
  getCommandesClient(clientId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/client/${clientId}`);
  }

  // Modifier une commande
  modifierCommande(commandeId: number, items: MenuQuantite[]): Observable<Commande> {
    return this.http.put<Commande>(`${this.baseUrl}/modifier/${commandeId}`, items);
  }

  // Supprimer une commande
  supprimerCommande(commandeId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/commandes/supprimer/${commandeId}`);
  }
  

 // Récupérer une commande par son ID
 getCommandeById(commandeId: number): Observable<Commande> {
  return this.http.get<Commande>(`${this.baseUrl}/${commandeId}`);
}

}
