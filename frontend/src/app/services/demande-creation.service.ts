import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const API_URL = 'http://localhost:8080/api/demandes';

@Injectable({
  providedIn: 'root'
})
export class DemandeCreationService {
  constructor(private http: HttpClient) {}
  
  // Méthode privée pour récupérer le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('respo_token');
    if (!token) {
      console.warn('Aucun token trouvé dans localStorage');
      return new HttpHeaders();
    } else {
      console.log('Token trouvé: ' + token.substring(0, 10) + '...');
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
  }
  
  // Pour l'upload d'image, nous devons utiliser des en-têtes spéciaux
  private getUploadHeaders(): HttpHeaders {
    const token = localStorage.getItem('respo_token');
    if (!token) {
      console.warn('Aucun token trouvé dans localStorage');
      return new HttpHeaders();
    } else {
      // Pour l'upload de fichier, ne pas définir Content-Type
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
  }
  
  // ➤ Créer une demande de club
  creerDemandeClub(data: { nom: string; etablissement: string; imageURL: string }): Observable<any> {
    console.log('Envoi de la demande de club:', data);
    return this.http.post(`${API_URL}/club`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Réponse de création de club:', response)),
      catchError(error => {
        console.error('Erreur lors de la création du club:', error);
        return throwError(() => error);
      })
    );
  }
  
  // ➤ Récupérer les demandes du responsable connecté
  getMesDemandes(): Observable<any> {
    return this.http.get(`${API_URL}/mes-demandes`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Réponse getMesDemandes:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des demandes:', error);
        return throwError(() => error);
      })
    );
  }
  
  // ➤ Upload d'image
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Envoi du fichier:', file.name, file.type, file.size);
    
    return this.http.post(`http://localhost:8080/api/demandes/upload`, formData, {
      headers: this.getUploadHeaders()
    }).pipe(
      tap(response => console.log('Réponse d\'upload:', response)),
      catchError(error => {
        console.error('Erreur lors de l\'upload:', error);
        return throwError(() => error);
      })
    );
  }
    
  
  // ➤ Créer une demande d'équipe
  creerDemandeEquipe(data: { nom: string; nbrJoueurs: number; imageURL: string }): Observable<any> {
    return this.http.post(`${API_URL}/equipe`, data, {
      headers: this.getAuthHeaders()
    });
  }    
  
  // ➤ Récupérer les demandes en attente (admin uniquement)
  getDemandesEnAttente(): Observable<any> {
    return this.http.get(`${API_URL}/en-attente`, {
      headers: this.getAuthHeaders()
    });
  }    
  
 
  
  // ➤ Récupérer une demande par ID
  getDemandeById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }    
  
  // ➤ Approuver une demande (admin uniquement)
  approuverDemande(id: number, commentaire: string): Observable<any> {
    return this.http.put(`${API_URL}/${id}/approuver`, { commentaire }, {
      headers: this.getAuthHeaders()
    });
  }    
  
  // ➤ Refuser une demande (admin uniquement)
  refuserDemande(id: number, commentaire: string): Observable<any> {
    return this.http.put(`${API_URL}/${id}/refuser`, { commentaire }, {
      headers: this.getAuthHeaders()
    });
  }     
  
  
}