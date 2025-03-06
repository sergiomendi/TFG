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
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { Paciente } from '../models/paciente';
import { FormsModule } from '@angular/forms';

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
    Dialog,
    Select,
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
  pacientes: Paciente[] | undefined;

  pacienteSeleccionado: Paciente | undefined;
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
      { nombre: 'New York', fechaAlta: new Date() },
      { nombre: 'Rome', fechaAlta: new Date() },
      { nombre: 'London', fechaAlta: new Date() },
      { nombre: 'Istanbul', fechaAlta: new Date() },
      { nombre: 'Paris', fechaAlta: new Date() },
      { nombre: 'Rome', fechaAlta: new Date() },
      { nombre: 'London', fechaAlta: new Date() },
      { nombre: 'Istanbul', fechaAlta: new Date() },
      { nombre: 'Paris', fechaAlta: new Date() },
      { nombre: 'Istanbul', fechaAlta: new Date() },
      { nombre: 'Paris', fechaAlta: new Date() },
      { nombre: 'Rome', fechaAlta: new Date() },
      { nombre: 'London', fechaAlta: new Date() },
      { nombre: 'Istanbul', fechaAlta: new Date() },
      { nombre: 'Paris', fechaAlta: new Date() },
    ];
    // this.productService.getProductsMini().then((data) => {
    //   this.products = data;
    // });
  }
  showDialog() {
    this.visible = true;
  }
}
