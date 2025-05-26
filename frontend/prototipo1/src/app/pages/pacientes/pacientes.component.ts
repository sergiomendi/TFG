import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
  faPlus,
  faFaceSmile,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MiDialogComponent } from '../../components/dialog/dialog.component';
import { Dialog } from 'primeng/dialog';
import { Paciente } from '../../models/paciente';
import { ModalCrearPacienteComponent } from './modal-crear-paciente/modal-crear-paciente.component';
import {
  MiTablaComponent,
  TableColumn,
} from '../../components/table/mi-tabla.component';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/api-respuesta';
import { getCurrentDayUnix, unixToShortDate } from '../../helpers/time';
import { MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { ModalDetallePacienteComponent } from './modal-detalle-paciente/modal-detalle-paciente.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    CommonModule,
    TextareaModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    ButtonModule,
    FontAwesomeModule,
    MiDialogComponent,
    ModalCrearPacienteComponent,
    MiTablaComponent,
    ModalDetallePacienteComponent,
  ],
  templateUrl: './pacientes.component.html',
})
export class PacientesComponent implements OnInit {
  @ViewChild('dialogDetallePaciente') dialogDetallePaciente: Dialog | undefined;
  @ViewChild('dialogCrear') dialogCrear: Dialog | undefined;
  @ViewChild('dialogEliminar') dialogEliminar: Dialog | undefined;
  ModalEliminarVisible: boolean = false;
  pacientes: Paciente[] = [];
  columns: TableColumn[] = [];
  idSelectedPaciente: number | null = null;
  faMagnifyingGlass = faMagnifyingGlass;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faPlus = faPlus;
  faEye = faEye;
  faFaceSmile = faFaceSmile;

  isModalEditar: boolean = false;
  crearPacienteForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.crearPacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      fechaAlta: [getCurrentDayUnix(), Validators.required],
      comentarios: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchPacientes();

    this.columns = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'fechaAlta', header: 'Fecha de alta' },
      { field: 'accion1', header: 'Experiencias', width: '25%' },
      { field: 'accion2', header: '', width: '2%' },
      { field: 'accion3', header: '', width: '2%' },
    ];
  }

  fetchPacientes(): void {
    this.apiService.getPacientes().subscribe({
      next: (response: ApiResponse) => {
        if (response.ok) {
          this.pacientes = response.data.map((paciente: any) => ({
            ...paciente,
            fechaAlta: unixToShortDate(paciente.fechaAlta),
          }));
        }
      },
    });
  }

  eliminarPaciente(): void {
    if (this.idSelectedPaciente !== null) {
      this.apiService.deletePaciente(this.idSelectedPaciente).subscribe({
        next: () => {
          this.idSelectedPaciente = null;
          if (this.dialogEliminar) this.dialogEliminar.visible = false;
          this.ModalEliminarVisible = false;
          this.fetchPacientes();
          this.showToast('Elemento eliminado');
        },
      });
    }
  }

  showToast(msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: msg,
      life: 3000,
    });
  }

  onCreateSubmit(): void {
    if (this.isModalEditar) {
      this.apiService
        .updatePaciente(this.idSelectedPaciente!, this.crearPacienteForm.value)
        .subscribe({
          next: () => {
            this.fetchPacientes();
            if (this.dialogCrear) this.dialogCrear.visible = false;
          },
        });
    } else {
      this.apiService.createPaciente(this.crearPacienteForm.value).subscribe({
        next: () => {
          this.fetchPacientes();
          if (this.dialogCrear) this.dialogCrear.visible = false;
          this.showToast('Elemento creado');
        },
      });
    }
  }

  showDialogCrearExp() {
    this.crearPacienteForm.reset({
      nombre: '',
      fechaAlta: getCurrentDayUnix(),
      comentarios: '',
    });
    this.idSelectedPaciente = null;
    if (this.dialogCrear) {
      this.dialogCrear.visible = true;
    }
  }

  showDialogEditarExp(id: number) {
    if (this.dialogCrear) {
      this.idSelectedPaciente = id;
      this.dialogCrear.visible = true;
    }
  }

  showDialogEliminarExp(id: number) {
    if (this.dialogEliminar) {
      this.idSelectedPaciente = id;
      this.dialogEliminar.visible = true;
      this.ModalEliminarVisible = true;
    }
  }

  showDialogDetallePaciente(id: number) {
    if (this.dialogDetallePaciente) {
      this.idSelectedPaciente = id;
      this.dialogDetallePaciente.visible = true;
    }
  }
}
