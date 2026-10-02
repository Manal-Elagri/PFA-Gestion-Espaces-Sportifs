import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mon-espace-popup',
  templateUrl: './mon-espace-popup.component.html',
  styleUrls: ['./mon-espace-popup.component.css']
})
export class MonEspacePopupComponent {
  showFirstCard = true;
  isVisible = false;

  constructor(private router: Router) { }


  openPopup() {
    this.isVisible = true;
    this.showFirstCard = true;
  }

  closePopup() {
    this.isVisible = false;
  }

  goToSecondCard() {
    this.showFirstCard = false;
  }


  goToLogin() {
    this.closePopup();
    this.router.navigate(['/compte-responsable/login']);
  }

  goToRegister(type: string) {
    this.closePopup();
    if (type === 'student') {
      this.router.navigate(['/register-student']);
    } else if (type === 'professor') {
      this.router.navigate(['/register-professor']);
    }
  }



}
