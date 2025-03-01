import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'menu-bar',
  imports: [
    Menubar,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    Ripple,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './menu-bar.component.html',
})
export class MenuBarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Pacientes',
        icon: 'pi pi-home',
        routerLink: '/pacientes',
      },
      {
        label: 'Escenas',
        icon: 'pi pi-search',
        badge: '3',
        routerLink: '/escenas',
      },
    ];
  }
}
