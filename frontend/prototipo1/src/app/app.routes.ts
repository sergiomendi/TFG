import { Routes } from '@angular/router';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { EscenasComponent } from './pages/escenas/escenas.component';
import { PlayComponent } from './pages/play/play.component';

export const routes: Routes = [
  { path: '', redirectTo: '/escenas', pathMatch: 'full' },
  { path: 'escenas', component: EscenasComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'play', component: PlayComponent },
];
