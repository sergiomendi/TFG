import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
import { MiDialogComponent } from '../components/dialog/dialog.component';
import { MiSelectComponent } from '../components/select/select.component';
import { Dialog } from 'primeng/dialog';
import { Paciente } from '../models/paciente';
import { ModalCrearPacienteComponent } from './modal-crear-paciente/modal-crear-paciente.component';
import {
  MiTablaComponent,
  TableColumn,
} from '../components/table/mi-tabla.component';
@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    ButtonModule,
    FontAwesomeModule,
    MiDialogComponent,
    ModalCrearPacienteComponent,
    MiTablaComponent,
  ],
  templateUrl: './pacientes.component.html',
})
export class PacientesComponent {
  @ViewChild('dialogCrear') dialogCrear: Dialog | undefined;
  @ViewChild('dialogEliminar') dialogEliminar: Dialog | undefined;
  pacientes!: Paciente[];
  columns: TableColumn[] = [];
  faMagnifyingGlass = faMagnifyingGlass;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faPlus = faPlus;
  ModalCrearVisible: boolean = false;
  ModalEliminarVisible: boolean = false;
  isModalEditar: boolean = false;

  constructor() {
    this.pacientes = [
      {
        nombre: 'Paciente 1',
        fechaAlta: new Date('2023-01-01').toLocaleDateString(),
      },
      {
        nombre: 'Paciente 2',
        fechaAlta: new Date('2023-02-15').toLocaleDateString(),
      },
      {
        nombre: 'Paciente 3',
        fechaAlta: new Date('2023-03-20').toLocaleDateString(),
      },
      {
        nombre: 'Paciente 4',
        fechaAlta: new Date('2023-04-10').toLocaleDateString(),
      },
      {
        nombre: 'Paciente 5',
        fechaAlta: new Date('2023-05-05').toLocaleDateString(),
      },
    ];

    this.columns = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'fechaAlta', header: 'Fecha de alta' },
      { field: 'accion1', header: '', width: '5%' },
      { field: 'accion2', header: '', width: '5%' },
    ];
  }

  showDialogCrearExp() {
    if (this.dialogCrear) {
      this.dialogCrear.visible = true;
    }
  }

  showDialogEliminarExp() {
    if (this.dialogEliminar) {
      this.dialogEliminar.visible = true;
    }
  }
}
