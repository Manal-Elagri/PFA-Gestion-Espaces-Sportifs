import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    document.querySelector('.sidebar')?.classList.toggle('active');
  }


  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}
  
  logout(): void {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }
  
}