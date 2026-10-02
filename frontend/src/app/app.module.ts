import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component'; 

import { FooterComponent } from './footer/footer.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { AboutComponent } from './about/about.component';
import { TeamComponent } from './terrain_user/team.component';
import { ApiService } from './api.service';  // Importation du service
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './admin/login/login.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';
 // Importer le module de routing
import { ClientFormComponent } from './client-form/client-form.component';
import { NgChartsModule } from 'ng2-charts';
import { RegisterComponent } from './admin/register/register.component';
import { CompetitionComponent } from './admin/competition/competition.component';
import { ReservationsComponent } from './admin/reservations/reservations.component';
import { StatisticsComponent } from './admin/statistics/statistics.component';
import { TerrainsComponent } from './admin/terrains/terrains.component';
import { UtilisateursComponent } from './admin/utilisateurs/utilisateurs.component';
import { MenuComponent } from './competition_user/menu.component';
import { LayoutBienvenuComponent } from './espace-responsable/layout-bienvenu/layout-bienvenu.component';
import { ChoixRoleComponent } from './espace-responsable/choix-role/choix-role.component';
import { RegisterProfComponent } from './espace-responsable/register-prof/register-prof.component';
import { RegisterEtudientComponent } from './espace-responsable/register-etudient/register-etudient.component';
import { CardCarouselComponent } from './card-carousel/card-carousel.component';
import { MonEspacePopupComponent } from './mon-espace-popup/mon-espace-popup.component';
import { RegisterStudentComponent } from './register-student/register-student.component';
import { RegisterProfessorComponent } from './register-professor/register-professor.component';
import { LoginRespoComponent } from './login-respo/login-respo.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardLayoutComponent } from './Dashboard-User/dashboard-layout/dashboard-layout.component';
import { ClubComponent } from './Dashboard-User/club/club.component';
import { EquipeComponent } from './Dashboard-User/equipe/equipe.component';
import { DashboardUsComponent } from './Dashboard-User/dashboard-us/dashboard-us.component';
import { CompetitionsComponent } from './Dashboard-User/competitions/competitions.component';
import { ParametresComponent } from './Dashboard-User/parametres/parametres.component';
import { TableauDeBordComponent } from './Dashboard-User/tableau-de-bord/tableau-de-bord.component';
import { MonProfilComponent } from './Dashboard-User/mon-profil/mon-profil.component';
import { ReservationsUserComponent } from './Dashboard-User/reservations-user/reservations-user.component';

import { FilterPipe } from './Dashboard-User/filter.pipe';
import { RejoindreCompetitionComponent } from './admin/rejoindre-competition/rejoindre-competition.component'; // adapte le chemin selon ton projet



// Importations des modules Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TerrainCalendarComponent } from './Dashboard-User/terrain-calendar/terrain-calendar.component';





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    BookingFormComponent,
    AboutComponent,
    TeamComponent,
    LoginComponent,
    AdminLayoutComponent,
    HomeComponent,
    ClientFormComponent,
    RegisterComponent,
    CompetitionComponent,
    ReservationsComponent,
    StatisticsComponent,
    TerrainsComponent,
    UtilisateursComponent,
    MenuComponent,
    LayoutBienvenuComponent,
    ChoixRoleComponent,
    RegisterProfComponent,
    RegisterEtudientComponent,
    CardCarouselComponent,
    MonEspacePopupComponent,
    RegisterStudentComponent,
    RegisterProfessorComponent,
    LoginRespoComponent,
    ResetPasswordComponent,
    DashboardLayoutComponent,
    ClubComponent,
    EquipeComponent,
    DashboardUsComponent,
    CompetitionsComponent,
    ParametresComponent,
    TableauDeBordComponent,
    MonProfilComponent,
    ReservationsUserComponent,
    FilterPipe,
    RejoindreCompetitionComponent,
    TerrainCalendarComponent

  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule, 
    FormsModule, // Ajoutez FormsModule ici
    AppRoutingModule,
    NgChartsModule, // Ajouter le module de routing dans les imports
      // Modules Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgxChartsModule
  ],
  providers: [ApiService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
