import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsableService {

  private baseUrl = 'http://localhost:8080/api'; // Base URL de ton backend
  private tokenKey = 'respo_token';
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {    
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.isAuthenticated.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/compte-responsable/login`, { email, password }, { responseType: 'json' }).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }


 

////////////////////////////////////////////////////////
// Ajouter cette méthode pour accéder à l'URL de base
getBaseUrl(): string {
  return this.baseUrl;
}

  // Vous pourriez aussi ajouter ces méthodes pour le mot de passe oublié
  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/compte-responsable/forgot-password`, { email });
  }
  
  resetPassword(token: string, password: string) {
    return this.http.post(`${this.baseUrl}/compte-responsable/reset-password`, { token, password });
  }


/////////////////////////////////////////////////////////////
  registerResponsable(data: any): Observable<any> {
    // Spécifiez responseType: 'text' car vous renvoyez une chaîne de texte du backend
    return this.http.post<any>(`${this.baseUrl}/compte-responsable/register`, data, { responseType: 'text' as 'json' });
  }

  

  getDashboard(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/compte-responsable/dashboard/${id}`);
  }

  updateResponsable(id: number, updatedResponsable: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/compte-responsable/update/${id}`, updatedResponsable);
  }

  deleteResponsable(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/compte-responsable/delete/${id}`, { responseType: 'text' });
  }

  // ----------------------- Clubs -----------------------

  getClubsByResponsable(responsableId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/clubs/responsable/${responsableId}`);
  }

  createClub(responsableId: number, club: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/clubs/responsable/${responsableId}/save`, club);
  }

  updateClub(id: number, club: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/clubs/update/${id}`, club);
  }

  deleteClub(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clubs/delete/${id}`);
  }

  uploadClubImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/clubs/upload`, formData);
  }

  // ----------------------- Équipes -----------------------

  getEquipesByResponsable(responsableId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/equipes/responsable/${responsableId}`);
  }

  getEquipeById(equipeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/equipes/${equipeId}`);
  }

  createEquipe(responsableId: number, equipe: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/equipes/create/${responsableId}`, equipe);
  }

  updateEquipe(equipeId: number, equipe: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/equipes/update/${equipeId}`, equipe);
  }

  deleteEquipe(equipeId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/equipes/delete/${equipeId}`, { responseType: 'text' });
  }

  uploadEquipeImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/equipes/upload`, formData);
  }

  // ----------------------- Participations Compétitions -----------------------

  joinCompetition(clubId: number, competitionId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/competitions/join/${clubId}/${competitionId}`, {});
  }

}
