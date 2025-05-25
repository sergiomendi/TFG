import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { TableColumn } from '../../../components/table/mi-tabla.component';
import { UnixToShortDatePipe } from '../../../pipes/unix-to-short-date';
import { ApiService } from '../../../services/api.service';
import { ApiResponse } from '../../../models/api-respuesta';

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
    ReactiveFormsModule,
    UnixToShortDatePipe,
  ],
})
export class ModalCrearPacienteComponent implements OnChanges {
  @Input() isModalEditar: boolean = false;
  @Input() formGroup!: FormGroup;
  @Input() idPaciente: number | null = null;
  @Input() nombrePaciente: string = '';

  columns: TableColumn[] = [];
  faMagnifyingGlass = faMagnifyingGlass;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faPlus = faPlus;

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idPaciente'] && this.isModalEditar && this.idPaciente) {
      this.apiService.getPacienteById(this.idPaciente).subscribe({
        next: (response: ApiResponse) => {
          this.formGroup.patchValue({
            nombre: response.data.nombre,
            fechaAlta: response.data.fechaAlta,
            comentarios: response.data.comentarios,
          });
        },
      });
    }
  }
}
