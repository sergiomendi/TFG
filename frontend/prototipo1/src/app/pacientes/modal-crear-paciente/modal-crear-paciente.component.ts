import { Component, Input, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { RegistroExperiencia } from '../../models/registro-experiencia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import {
  faFaceSmile,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faPlus,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import {
  MiTablaComponent,
  TableColumn,
} from '../../components/table/mi-tabla.component';
import { MiDialogComponent } from '../../components/dialog/dialog.component';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'modal-crear-paciente-content',
  standalone: true,
  templateUrl: './modal-crear-paciente.component.html',
  imports: [
    TextareaModule,
    InputTextModule,
    TableModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    ButtonModule,
    FontAwesomeModule,
    MiTablaComponent,
    MiDialogComponent,
  ],
})
export class ModalCrearPacienteComponent {
  @Input() isModalEditar: boolean = false;
  @ViewChild('dialogDetalleExperiencia') dialogDetalleExperiencia:
    | Dialog
    | undefined;

  columns: TableColumn[] = [];
  faMagnifyingGlass = faMagnifyingGlass;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faPlus = faPlus;
  faFaceSmile = faFaceSmile;
  faEye = faEye;
  ModalDetalleExperienciaVisible: boolean = false;

  experiencias: RegistroExperiencia[] = [
    new RegistroExperiencia('2023-01-01', 'Experiencia 1'),
    new RegistroExperiencia('2023-02-01', 'Experiencia 2'),
    new RegistroExperiencia('2023-03-01', 'Experiencia 3'),
  ];

  constructor() {
    this.columns = [
      { field: 'titulo', header: 'Titulo' },
      { field: 'fechaAlta', header: 'Fecha de alta' },
      { field: 'tiempoTotal', header: 'Duración (min)' },
      { field: 'accion1', header: 'Ansiedad Inicio', width: '15%' },
      { field: 'accion2', header: 'Ansiedad Final', width: '15%' },
      { field: 'accion3', header: 'Ansiedad Media', width: '15%' },
      { field: 'accion4', header: '', width: '10%' },
    ];
  }
  showDialogDetalleExp() {
    if (this.dialogDetalleExperiencia) {
      this.dialogDetalleExperiencia.visible = true;
    }
  }
}
