import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Competition, Club, StatutParticipation, ClubCompetition } from './models';

import { 
    ReservationTerrain, 
    Terrain, 
    EtatReservationTerrain, 
    Equipe,
    JoursOccupes,
    CalendrierData
  } from './models-terrain-reservation';
 

 const apiUrl = 'http://localhost:8080/api';

 @Injectable({
   providedIn: 'root'
 })
 export class TableauUserService {  

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

       getMesDemandes(): Observable<any> {
          return this.http.get(`${apiUrl}/mes-demandes`, {
            headers: this.getAuthHeaders()
          }).pipe(
            tap(response => console.log('Réponse getMesDemandes:', response)),
            catchError(error => {
              console.error('Erreur lors de la récupération des demandes:', error);
              return throwError(() => error);
            })
          );
        }

         // Récupérer mes équipes (qui peuvent faire des réservations)
            getMesEquipes(): Observable<Equipe[]> {
              return this.http.get<Equipe[]>(`${apiUrl}/reservations/mes-equipes`, {
                headers: this.getAuthHeaders()
              }).pipe(
                tap(response => console.log('Équipes récupérées:', response)),
                catchError(error => {
                  console.error('Erreur lors de la récupération des équipes:', error);
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


      
        // Dans CompetitionService
      getAllParticipations(): Observable<ClubCompetition[]> {
        return this.http.get<ClubCompetition[]>(`${apiUrl}/admin/all-participations`);
       } 




}