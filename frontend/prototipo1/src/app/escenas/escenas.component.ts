import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Escena } from '../models/escena';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCirclePlay,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MiDialogComponent } from '../components/dialog/dialog.component';
import { MiSelectComponent } from '../components/select/select.component';
import { Dialog } from 'primeng/dialog';
import { ModalCrearEscenaComponent } from './modal-crear-escena/modal-crear-escena.component';

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
    ModalCrearEscenaComponent,
  ],
  templateUrl: './escenas.component.html',
})
export class EscenasComponent {
  @ViewChild('dialogIniciar') dialogIniciar: Dialog | undefined;
  @ViewChild('dialogCrear') dialogCrear: Dialog | undefined;
  escenas!: Escena[];
  faCirclePlay = faCirclePlay;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faPlus = faPlus;
  faMagnifyingGlass = faMagnifyingGlass;
  ModalIniciarExpVisible: boolean = false;
  ModalCrearExpVisible: boolean = false;
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
  }

  showDialogCrearExp() {
    if (this.dialogCrear) {
      this.dialogCrear.visible = true;
    }
  }
  showDialogIniciarExp() {
    if (this.dialogIniciar) {
      this.dialogIniciar.visible = true;
    }
  }
}
