import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ResponsableService } from 'src/app/services/responsable.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardResponsable implements CanActivate {
    constructor(private responsableService: ResponsableService, private router: Router) {}
   
     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
       if (this.responsableService.isLoggedIn()) {
         return true;
       }
   
       localStorage.setItem('redirectUrl', state.url);
       this.router.navigate(['/compte-responsable/login']);
       return false;
     }
}