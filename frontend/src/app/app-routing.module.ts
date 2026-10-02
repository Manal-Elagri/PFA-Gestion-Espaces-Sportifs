// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './admin/login/login.component';
import { RegisterComponent } from './admin/register/register.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component'; // importe ton composant
import { CompetitionComponent } from './admin/competition/competition.component'; 
import { ReservationsComponent } from './admin/reservations/reservations.component'; 
import { StatisticsComponent } from './admin/statistics/statistics.component'; // importe ton composant
import { TerrainsComponent } from './admin/terrains/terrains.component'; // importe ton composant
import { UtilisateursComponent } from './admin/utilisateurs/utilisateurs.component'; // importe ton composant
import { RegisterStudentComponent } from './register-student/register-student.component';
import { RegisterProfessorComponent } from './register-professor/register-professor.component';
import { AuthGuardResponsable } from './auth.guard.responsable';
import { MonEspacePopupComponent } from './mon-espace-popup/mon-espace-popup.component';
import { LoginRespoComponent } from './login-respo/login-respo.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardLayoutComponent } from './Dashboard-User/dashboard-layout/dashboard-layout.component';
import { ClubComponent } from './Dashboard-User/club/club.component';
import { EquipeComponent } from './Dashboard-User/equipe/equipe.component';
import { DashboardUsComponent } from './Dashboard-User/dashboard-us/dashboard-us.component';

import { MonProfilComponent } from './Dashboard-User/mon-profil/mon-profil.component';
import { ParametresComponent } from './Dashboard-User/parametres/parametres.component';

import { ReservationsUserComponent } from './Dashboard-User/reservations-user/reservations-user.component';

import { CompetitionsComponent } from './Dashboard-User/competitions/competitions.component';
import { TableauDeBordComponent } from './Dashboard-User/tableau-de-bord/tableau-de-bord.component';
import { RejoindreCompetitionComponent } from './admin/rejoindre-competition/rejoindre-competition.component';


const routes: Routes = [
  { path: '', component: HomeComponent },

  // Routes client indépendantes
  { path: 'espace-popus', component: MonEspacePopupComponent },
 

  { path: 'register-student', component: RegisterStudentComponent },
  { path: 'register-professor', component: RegisterProfessorComponent },
  { path:  'reset-password', component: ResetPasswordComponent },
  { path: 'compte-responsable/login', component: LoginRespoComponent },
  {
    path: 'dashboard-user',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuardResponsable],
    children: [
      { path: '', redirectTo: 'dashboardus', pathMatch: 'full' },
      { path: 'dashboardus', component: DashboardUsComponent }, // AJOUTE CECI
      { path: 'club', component: ClubComponent },
      { path: 'equipe', component: EquipeComponent },
      { path: 'tableau-de-bord', component: TableauDeBordComponent },
      { path: 'reservations-user', component: ReservationsUserComponent },
      { path: 'competitions', component: CompetitionsComponent },
      { path: 'parametres', component: ParametresComponent },
      { path: 'mon-profil', component: MonProfilComponent },
      
    ]
  },

  
  { path: 'admin/register', component: RegisterComponent }, 
  { path: 'admin/login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent }, // AJOUTE CECI
      { path: 'competition', component: CompetitionComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'terrains', component: TerrainsComponent },
      { path: 'utilisateurs', component: UtilisateursComponent },
      { path: 'rejoindre-competition', component: RejoindreCompetitionComponent },
      
      
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }