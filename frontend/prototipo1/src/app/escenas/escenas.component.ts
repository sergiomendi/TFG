import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Escena } from '../models/escena';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCirclePlay,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Paciente } from '../models/paciente';
import { FormsModule } from '@angular/forms';
import { MiDialogComponent } from '../components/dialog/dialog.component';
import { MiSelectComponent } from '../components/select/select.component';

@Component({
  selector: 'app-escenas',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    FontAwesomeModule,
    MiDialogComponent,
    MiSelectComponent,
  ],
  templateUrl: './escenas.component.html',
})
export class EscenasComponent {
  escenas!: Escena[];
  faCirclePlay = faCirclePlay;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faMagnifyingGlass = faMagnifyingGlass;
  visible: boolean = false;
  pacientes: any[] | undefined;

  pacienteSeleccionado: [] | undefined;
  constructor() {}

  ngOnInit() {
    this.escenas = [
      { titulo: 'Escena 1', fechaAlta: new Date() },
      { titulo: 'Escena 2', fechaAlta: new Date() },
      { titulo: 'Escena 3', fechaAlta: new Date() },
      { titulo: 'Escena 4', fechaAlta: new Date() },
      { titulo: 'Escena 5', fechaAlta: new Date() },
    ];
    this.pacientes = [
      'New York',
      'Rome',
      'London',
      'Istanbul',
      'Paris',
      'Rome',
      'London',
    ];
    // this.productService.getProductsMini().then((data) => {
    //   this.products = data;
    // });
  }

  showDialog() {
    this.visible = true;
    this.visible = false;
  }
}
