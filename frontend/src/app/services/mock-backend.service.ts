import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators'; // Import the delay operator

@Injectable({
  providedIn: 'root'
})
export class MockBackendService {

  constructor() {}

  submitForm(formData: any) {
    // La fonction utilise la fonction of de l'observable RxJS pour créer un observable qui émet une seule valeur. Dans ce cas, la valeur émise est un objet { success: true }.
    //La fonction delay(1000) introduit un délai artificiel de 1000 millisecondes (1 seconde).
    return of({ success: true }).pipe(delay(1000));
  }
}
