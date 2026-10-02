import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  scrollTo(targetId: string) {
    //methode prend en parametre l'id de l'élément cible vers lequel vous souhaitez faire défiler la page
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const yOffset = -100; // Adjust this value to fine-tune the scrolling position
      const yPosition = targetElement.getBoundingClientRect().top + window.scrollY + yOffset; //windows.scrolly , la position actuelle de défilement
       //pour effectuer un défilement fluide vers la position calculer
      window.scrollTo({ top: yPosition, behavior: 'smooth' });
    }
  }
}
