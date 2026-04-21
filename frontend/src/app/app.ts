import { Component, signal } from '@angular/core';
import { Portafolio } from './components/portafolio/portafolio';

@Component({
  selector: 'app-root',
  imports: [Portafolio],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portafolioMIguel');
}
