import { Component, Input } from '@angular/core';
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
import { MiDialogComponent } from '../../components/dialog/dialog.component';
import {
  faFaceSmile,
  faCirclePlay,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

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
  ],
})
export class ModalCrearPacienteComponent {
  @Input() isModalEditar: boolean = false;

  faMagnifyingGlass = faMagnifyingGlass;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faPlus = faPlus;
  faFaceSmile = faFaceSmile;
  experiencias: RegistroExperiencia[] = [
    new RegistroExperiencia('2023-01-01', 'Experiencia 1'),
    new RegistroExperiencia('2023-02-01', 'Experiencia 2'),
    new RegistroExperiencia('2023-03-01', 'Experiencia 3'),
  ];

  constructor() {}
}
