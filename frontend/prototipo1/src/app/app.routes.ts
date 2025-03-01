import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PacientesComponent } from './pacientes/pacientes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  //   { path: 'escenas', component: EscenasComponent },
  { path: 'pacientes', component: PacientesComponent },
];
