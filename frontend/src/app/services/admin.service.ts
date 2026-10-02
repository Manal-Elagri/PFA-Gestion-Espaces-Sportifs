import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8080/api/admin'; // adapte si besoin
  private tokenKey = 'admin_token';
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient) {    
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.isAuthenticated.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }, { responseType: 'json' }).pipe(
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

  // ---------- Authentification ----------
  register(admin: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, admin);
  }

  // ---------- Test d'email ----------
  testEmail(to: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/test-email`, null, {
      params: new HttpParams().set('to', to)
    });
  }

  // ---------- Compétitions ----------
  createCompetition(competition: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/competitions`, competition);
  }

  updateCompetition(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/competitions/${id}`, data);
  }

  deleteCompetition(id: number): Observable<any> {
    return this.http.delete<boolean>(`${this.baseUrl}/competitions/${id}`);
  }
 
  getAllCompetitions(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/competitions`);
  }

  // ---------- Réservations ----------
  getReservationsEnAttente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reservations/en-attente`);
  }

  getReservationsValidees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reservations/validees`);
  }

  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reservations`);
  }

  getReservationsEnAttenteDepuis(heures: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reservations/notifications/${heures}`);
  }

  changeEtatReservation(id: number, newEtat: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/reservations/${id}/etat`, null, {
      params: new HttpParams().set('newEtat', newEtat)
    });
  }

  // ---------- Dashboard ----------
  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }

 


  // ---------- Clubs ----------
  getAllClubs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/clubs`);
  }

  getClubsByResponsable(responsableId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/responsable/${responsableId}/clubs`);
  }
  // ---------- Participations ----------
  getParticipationsParClub(clubId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/participations/club/${clubId}`);
  }

  getParticipationsParCompetition(competitionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/participations/competition/${competitionId}`);
  }

  getStatsParticipations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/participations/stats`);
  }

  changeParticipationStatus(id: number, newStatus: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/participations/${id}/status`, null, {
      params: new HttpParams().set('newStatus', newStatus)
    });
  }

  // ---------- Terrains ----------
  createTerrain(terrain: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/terrains`, terrain);
  }

  updateTerrain(id: number, terrain: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/terrains/${id}`, terrain);
  }

  deleteTerrain(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/terrains/${id}`);
  }
  
  getAllTerrain(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/terrains`);
  }

  // ---------- Équipes ----------
  getEquipesByResponsable(responsableId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/responsable/${responsableId}/equipes`);
  }
  
  getAllEquipes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/equipes`);
  }
  // ---------- Résultats de matchs ----------
  createResultatMatch(resultat: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/resultats`, resultat);
  }

  updateResultatMatch(id: number, resultat: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/resultats/${id}`, resultat);
  }

  deleteResultatMatch(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/resultats/${id}`);
  }

  // Dans AdminService, ajoutez cette méthode
  getAllResultatMatchs(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/all-resultats`);
  }

  // ---------- Table de score ----------
  createScore(score: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/scores`, score);
  }

  updateScore(id: number, score: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/scores/${id}`, score);
  }

  deleteScore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/scores/${id}`);
  }

  getScoreForClub(clubId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/scores/club/${clubId}`);
  }

  getAllScores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/scores`);
  }

  // ---------- Upload ----------
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }
}
