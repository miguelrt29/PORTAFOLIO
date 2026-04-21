import { Routes } from '@angular/router';
import { Portafolio } from './components/portafolio/portafolio';

export const routes: Routes = [
  { path: '', component: Portafolio },
  { path: '**', redirectTo: '' },
];