import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Competition, Club, StatutParticipation, ClubCompetition } from './models';

const apiUrl = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  constructor(private http: HttpClient) {}

  // Méthode privée pour récupérer le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('respo_token');
    if (!token) {
      console.warn('Aucun token trouvé dans localStorage');
      return new HttpHeaders();
    } else {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
  }


  // Nouvelle méthode pour récupérer les informations du responsable
    getResponsableInfo(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/compte-responsable/profile`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Informations du responsable récupérées:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des informations du responsable:', error);
        return throwError(() => error);
      })
    );
    }

  // Récupérer mes clubs
  getMesClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(`${apiUrl}/clubs/mes-clubs`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Clubs récupérés:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des clubs:', error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les compétitions à venir
  getCompetitionsAVenir(): Observable<Competition[]> {
    return this.http.get<Competition[]>(`${apiUrl}/admin/competitions/a-venir/json`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Compétitions récupérées:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des compétitions:', error);
        return throwError(() => error);
      })
    );
  }

  // Rejoindre une compétition
  joinCompetition(clubId: number, competitionId: number): Observable<any> {
    return this.http.post(
      `${apiUrl}/competitions/join/${clubId}/${competitionId}`, 
      {}, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('Inscription à la compétition réussie:', response)),
      catchError(error => {
        console.error('Erreur lors de l\'inscription à la compétition:', error);
        return throwError(() => error);
      })
    );
  }

  // Annuler une participation
  cancelParticipation(clubId: number, competitionId: number): Observable<any> {
    return this.http.delete(
      `${apiUrl}/competitions/cancel/${clubId}/${competitionId}`, 
      { 
        headers: this.getAuthHeaders(),
        responseType: 'text' 
      }
    ).pipe(
      tap(response => console.log('Participation annulée avec succès:', response)),
      catchError(error => {
        console.error('Erreur lors de l\'annulation de la participation:', error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les compétitions d'un club
  getCompetitionsByClub(clubId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${apiUrl}/competitions/club/${clubId}`, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('Participations du club récupérées:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des participations:', error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les statistiques de participation
  getStatistiquesParticipation(clubId: number): Observable<any> {
    return this.http.get<any>(
      `${apiUrl}/competitions/participations/statistiques/${clubId}`, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('Statistiques récupérées:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des statistiques:', error);
        // En cas d'erreur, on renvoie des stats vides plutôt que de planter l'application
        return of({ inscrits: 0, valides: 0, elimines: 0 });
      })
    );
  }

  //// ----------------------------- Partie Admin ------------------------------ ////

  getParticipationsParClub(clubId: number): Observable<ClubCompetition[]> {
    return this.http.get<ClubCompetition[]>(`${apiUrl}/admin/participations/club/${clubId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Participations du club récupérées:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des participations du club:', error);
        return throwError(() => error);
      })
    );
  }

  
  getParticipationsParCompetition(competitionId: number): Observable<ClubCompetition[]> {
    return this.http.get<ClubCompetition[]>(`${apiUrl}/admin/participations/competition/${competitionId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Participations de la compétition récupérées:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des participations de la compétition:', error);
        return throwError(() => error);
      })
    );
  }

  
  getStatsParticipations(): Observable<any> {
    return this.http.get<any>(`${apiUrl}/admin/participations/stats`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Statistiques des participations récupérées:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des statistiques des participations:', error);
        return throwError(() => error);
      })
    );
  }

  // Modifier pour utiliser le bon endpoint pour changer le statut d'une participation
  changeParticipationStatus(participationId: number, newStatus: StatutParticipation): Observable<void> {
    return this.http.put<void>(
      `${apiUrl}/admin/participations/${participationId}/status`, 
      {}, 
      {
        headers: this.getAuthHeaders(),
        params: { newStatus: newStatus }
      }
    ).pipe(
      tap(() => console.log(`Statut de la participation ${participationId} changé en ${newStatus}`)),
      catchError(error => {
        console.error('Erreur lors de la modification du statut de la participation:', error);
        return throwError(() => error);
      })
    );
  }


  // Dans CompetitionService
getAllParticipations(): Observable<ClubCompetition[]> {
  return this.http.get<ClubCompetition[]>(`${apiUrl}/admin/all-participations`);
}
}