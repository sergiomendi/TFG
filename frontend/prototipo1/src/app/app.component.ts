import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { PrimeNG } from 'primeng/config';
import { NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent, NgIf, ToastModule],
  providers: [MessageService],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'prototipo1';
  showAppBar: boolean = true;

  constructor(private primeng: PrimeNG, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showAppBar = !event.url.includes('/play');
      }
    });
  }

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
