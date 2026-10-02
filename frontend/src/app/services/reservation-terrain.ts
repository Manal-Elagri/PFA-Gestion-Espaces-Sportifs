/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ReservationTerrain, Terrain, EtatReservationTerrain, Equipe } from './models-terrain-reservation';

const apiUrl = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ReservationTerrainService {

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

  // Récupérer toutes les réservations
  getAllReservations(): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(`${apiUrl}/reservations/`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Toutes les réservations récupérées:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération de toutes les réservations:', error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer une réservation par ID
  getReservationById(id: number): Observable<ReservationTerrain> {
    return this.http.get<ReservationTerrain>(`${apiUrl}/reservations/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log(`Réservation ${id} récupérée:`, response)),
      catchError(error => {
        console.error(`Erreur lors de la récupération de la réservation ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Créer une nouvelle réservation
  passerReservation(equipeId: number, terrainId: number): Observable<ReservationTerrain> {
    return this.http.post<ReservationTerrain>(
      `${apiUrl}/reservations/passer/${equipeId}/${terrainId}`, 
      {}, // Corps vide car les identifiants sont dans l'URL
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('Réservation passée avec succès:', response)),
      catchError(error => {
        console.error('Erreur lors de la création de la réservation:', error);
        return throwError(() => error);
      })
    );
  }

  // Annuler une réservation
  annulerReservation(equipeId: number, terrainId: number): Observable<string> {
    return this.http.delete(
      `${apiUrl}/reservations/cancel/${equipeId}/${terrainId}`, 
      { 
        headers: this.getAuthHeaders(),
        responseType: 'text'
      }
    ).pipe(
      tap(response => console.log('Réservation annulée avec succès:', response)),
      catchError(error => {
        console.error('Erreur lors de l\'annulation de la réservation:', error);
        return throwError(() => error);
      })
    );
  }

  // Récupérer les terrains disponibles - MODIFIÉ pour correspondre à votre contrôleur
  getTerrainsDisponibles(): Observable<Terrain[]> {
    return this.http.get<Terrain[]>(
      `${apiUrl}/reservations/disponibles`, // Modifié pour correspondre à votre contrôleur
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => console.log('Terrains disponibles récupérés:', response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des terrains disponibles:', error);
        return throwError(() => error);
      })
    );
  }


  // ------ Partie Admin Gestion des Reservations ------ 


  getReservationsEnAttente(): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations/en-attente`,
      { headers: this.getAuthHeaders() }
    );
  }
  

  getReservationsValidees(): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations/validees`,
      { headers: this.getAuthHeaders() }
    );
  }

  
  getAllReservationsAdmin(): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations`,
      { headers: this.getAuthHeaders() }
    );
  }

  
  getReservationsEnAttenteDepuis(heures: number): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations/notifications/${heures}`,
      { headers: this.getAuthHeaders() }
    );
  }
  
  
  changeEtatReservation(id: number, newstatus: EtatReservationTerrain): Observable<void> {
    return this.http.put<void>(
      `${apiUrl}/admin/reservations/${id}/etat`,
      null, // Pas de corps, car `newstatus` est un paramètre
      {
        headers: this.getAuthHeaders(),
        params: { newstatus }
      }
    );
  }

  
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(
      `${apiUrl}/admin/dashboard`,
      { headers: this.getAuthHeaders() }
    );
  }
   
  getReservationsParEquipe(equipeId: number): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations/equipe/${equipeId}`,
      { headers: this.getAuthHeaders() }
    );
  }
  
}   */



  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError, tap } from 'rxjs/operators';
  import { 
    ReservationTerrain, 
    Terrain, 
    EtatReservationTerrain, 
    Equipe,
    JoursOccupes,
    CalendrierData
  } from './models-terrain-reservation';
  import { formatDate } from '@angular/common';
  
  const apiUrl = 'http://localhost:8080/api';
  
  @Injectable({
    providedIn: 'root'
  })
  export class ReservationTerrainService {
  
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
  
    // Récupérer toutes les réservations
    getAllReservations(): Observable<ReservationTerrain[]> {
      return this.http.get<ReservationTerrain[]>(`${apiUrl}/reservations/`, {
        headers: this.getAuthHeaders()
      }).pipe(
        tap(response => console.log('Toutes les réservations récupérées:', response)),
        catchError(error => {
          console.error('Erreur lors de la récupération de toutes les réservations:', error);
          return throwError(() => error);
        })
      );
    }
  
    // Récupérer une réservation par ID
    getReservationById(id: number): Observable<ReservationTerrain> {
      return this.http.get<ReservationTerrain>(`${apiUrl}/reservations/${id}`, {
        headers: this.getAuthHeaders()
      }).pipe(
        tap(response => console.log(`Réservation ${id} récupérée:`, response)),
        catchError(error => {
          console.error(`Erreur lors de la récupération de la réservation ${id}:`, error);
          return throwError(() => error);
        })
      );
    }
  
    // Créer une nouvelle réservation (mise à jour pour inclure la date du calendrier)
  // Correction de la méthode passerReservation dans ReservationTerrainService
  passerReservation(equipeId: number, terrainId: number, dateCalendrier: Date): Observable<ReservationTerrain> {
    // Formater la date au format ISO
    const formattedDate = dateCalendrier.toISOString().split("T")[0]

    console.log("Sending reservation request with:", {
      equipeId,
      terrainId,
      dateCalendrier: formattedDate,
    })

    // URL construction with proper parameters
    const url = `${apiUrl}/reservations/passer/${equipeId}/${terrainId}?dateCalendrier=${formattedDate}`
    console.log("Request URL:", url)

    return this.http
      .post<ReservationTerrain>(
        url,
        {}, // Corps vide car les identifiants sont dans l'URL
        { headers: this.getAuthHeaders() },
      )
      .pipe(
        tap((response) => console.log("Réservation passée avec succès:", response)),
        catchError((error) => {
          console.error("Erreur lors de la création de la réservation:", error)
          // Re-throw the error to be handled by the component
          return throwError(() => new Error(error.error?.message || "Erreur lors de la création de la réservation"))
        }),
      )
  }
    // Annuler une réservation
    annulerReservation(reservationId: number): Observable<any> {
      return this.http.delete(`${apiUrl}/reservations/cancel/${reservationId}`, {
        headers: this.getAuthHeaders()
      }).pipe(
        catchError(error => {
          console.error('Erreur lors de l\'annulation de la réservation:', error);
          throw error;
        })
      );
    }
  
    // Récupérer les terrains disponibles
    getTerrainsDisponibles(): Observable<Terrain[]> {
      return this.http.get<Terrain[]>(
        `${apiUrl}/reservations/disponibles`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        tap(response => console.log('Terrains disponibles récupérés:', response)),
        catchError(error => {
          console.error('Erreur lors de la récupération des terrains disponibles:', error);
          return throwError(() => error);
        })
      );
    }
  
    // Nouvelles méthodes pour le calendrier
  
    // Récupérer toutes les réservations validées
    getReservationsValides(): Observable<ReservationTerrain[]> {
      return this.http.get<ReservationTerrain[]>(
        `${apiUrl}/reservations/validees`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        tap(response => console.log('Réservations validées récupérées:', response)),
        catchError(error => {
          console.error('Erreur lors de la récupération des réservations validées:', error);
          return throwError(() => error);
        })
      );
    }
  
    // Récupérer les réservations validées pour un mois spécifique
    getReservationsValideesParMois(annee: number, mois: number): Observable<ReservationTerrain[]> {
      return this.http.get<ReservationTerrain[]>(
        `${apiUrl}/reservations/validees/mois/${annee}/${mois}`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        tap(response => console.log(`Réservations validées pour ${mois}/${annee}:`, response)),
        catchError(error => {
          console.error(`Erreur lors de la récupération des réservations pour ${mois}/${annee}:`, error);
          return throwError(() => error);
        })
      );
    }
  
   // Ajoutez cette méthode pour récupérer les réservations validées pour un terrain spécifique****************************
   getReservationsValideesParTerrain(terrainId: number): Observable<any[]> {
    console.log(`Récupération des réservations validées pour le terrain ${terrainId}`);
    
    return this.http.get<any[]>(`${apiUrl}/reservations/reservations/terrain/${terrainId}/validees`, {
      headers: this.getAuthHeaders() 
    }).pipe(
      tap(reservations => console.log('Réservations récupérées:', reservations)),
      catchError(error => {
        console.error('Erreur lors de la récupération des réservations validées:', error);
        return throwError(() => error);
      })
    );
  }

  
    // Récupérer les réservations validées pour un terrain et un mois spécifiques
    getReservationsValideesParTerrainEtMois(terrainId: number, annee: number, mois: number): Observable<ReservationTerrain[]> {
      return this.http.get<ReservationTerrain[]>(
        `${apiUrl}/reservations/validees/terrain/${terrainId}/mois/${annee}/${mois}`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        tap(response => console.log(`Réservations validées pour le terrain ${terrainId} en ${mois}/${annee}:`, response)),
        catchError(error => {
          console.error(`Erreur lors de la récupération des réservations pour le terrain ${terrainId} en ${mois}/${annee}:`, error);
          return throwError(() => error);
        })
      );
    }
  
    // Récupérer les jours occupés par terrain
    getJoursOccupesParTerrain(): Observable<JoursOccupes> {
      return this.http.get<JoursOccupes>(
        `${apiUrl}/reservations/jours-occupes`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        tap(response => console.log('Jours occupés par terrain:', response)),
        catchError(error => {
          console.error('Erreur lors de la récupération des jours occupés:', error);
          return throwError(() => error);
        })
      );
    }
  
    // Vérifier si un terrain est disponible à une date spécifique
    isTerrainDisponible(terrainId: number, date: Date): Observable<{terrainId: number, date: string, disponible: boolean}> {
      const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en');
      
      return this.http.get<{terrainId: number, date: string, disponible: boolean}>(
        `${apiUrl}/reservations/terrain/${terrainId}/disponible`,
        { 
          headers: this.getAuthHeaders(),
          params: new HttpParams().set('date', formattedDate)
        }
      ).pipe(
        tap(response => console.log(`Disponibilité du terrain ${terrainId} le ${formattedDate}:`, response)),
        catchError(error => {
          console.error(`Erreur lors de la vérification de la disponibilité du terrain ${terrainId} le ${formattedDate}:`, error);
          return throwError(() => error);
        })
      );
    }
  
    // Facultatif : méthode utilitaire pour générer les données du calendrier pour affichage
    getCalendrierData(): Observable<CalendrierData> {
      return this.http.get<CalendrierData>(
        `${apiUrl}/reservations/calendrier-data`,
        { headers: this.getAuthHeaders() }
      ).pipe(
        tap(response => console.log('Données du calendrier récupérées:', response)),
        catchError(error => {
          console.error('Erreur lors de la récupération des données du calendrier:', error);
          return throwError(() => error);
        })
      );
    }




     // ------ Partie Admin Gestion des Reservations ------ 


  getReservationsEnAttente(): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations/en-attente`,
      { headers: this.getAuthHeaders() }
    );
  }
  

  getReservationsValidees(): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations/validees`,
      { headers: this.getAuthHeaders() }
    );
  }

  
  getAllReservationsAdmin(): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations`,
      { headers: this.getAuthHeaders() }
    );
  }

  
  getReservationsEnAttenteDepuis(heures: number): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations/notifications/${heures}`,
      { headers: this.getAuthHeaders() }
    );
  }
  
  
  changeEtatReservation(id: number, newstatus: EtatReservationTerrain): Observable<void> {
    return this.http.put<void>(
      `${apiUrl}/admin/reservations/${id}/etat`,
      null, // Pas de corps, car `newstatus` est un paramètre
      {
        headers: this.getAuthHeaders(),
        params: { newstatus }
      }
    );
  }

  
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(
      `${apiUrl}/admin/dashboard`,
      { headers: this.getAuthHeaders() }
    );
  }
   
  getReservationsParEquipe(equipeId: number): Observable<ReservationTerrain[]> {
    return this.http.get<ReservationTerrain[]>(
      `${apiUrl}/admin/reservations/equipe/${equipeId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
  