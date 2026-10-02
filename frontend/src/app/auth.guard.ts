// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AdminService } from './services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private adminService: AdminService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.adminService.isLoggedIn()) {
      return true;
    }

    localStorage.setItem('redirectUrl', state.url);
    this.router.navigate(['/admin/login']);
    return false;
  }
}
