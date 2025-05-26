import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Escena } from '../../models/escena';
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
import { Message, MessageModule } from 'primeng/message';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MiDialogComponent } from '../../components/dialog/dialog.component';
import { MiSelectComponent } from '../../components/select/select.component';
import { Dialog } from 'primeng/dialog';
import { ModalCrearEscenaComponent } from './modal-crear-escena/modal-crear-escena.component';
import {
  MiTablaComponent,
  TableColumn,
} from '../../components/table/mi-tabla.component';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/api-respuesta';
import { getCurrentDayUnix, unixToShortDate } from '../../helpers/time';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-escenas',
  standalone: true,
  imports: [
    NgIf,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    ButtonModule,
    FontAwesomeModule,
    MiDialogComponent,
    MiSelectComponent,
    ModalCrearEscenaComponent,
    MiTablaComponent,
  ],
  templateUrl: './escenas.component.html',
})
export class EscenasComponent {
  escenas!: Escena[];
  columns: TableColumn[] = [];
  faCirclePlay = faCirclePlay;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faPlus = faPlus;
  faMagnifyingGlass = faMagnifyingGlass;
  ModalIniciarExpVisible: boolean = false;
  ModalCrearExpVisible: boolean = false;
  ModalEliminarVisible: boolean = false;
  pacientes: string[] = [];

  selectedIdEscena: number | null = null;
  createdExperienciaId: number | null = null;

  crearEscenaForm: FormGroup;
  iniciarEscenaForm: FormGroup;

  isModalEditar: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.crearEscenaForm = this.fb.group({
      titulo: ['', Validators.required],
      fechaAlta: [getCurrentDayUnix(), Validators.required],
      descripcion: '',
      fotos: [[], Validators.required],
    });
    this.iniciarEscenaForm = this.fb.group({
      idPaciente: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchEscenas();
    this.fetchPacientesSelect();
    this.columns = [
      { field: 'accion1', header: '', width: '5%' },
      { field: 'titulo', header: 'Titulo' },
      { field: 'fechaAlta', header: 'Fecha de alta' },
      { field: 'accion2', header: '', width: '5%' },
      { field: 'accion3', header: '', width: '5%' },
    ];
  }

  fetchEscenas() {
    this.apiService.getEscenas().subscribe((response: ApiResponse) => {
      if (response.ok) {
        this.escenas = response.data.map((escena: any) => ({
          ...escena,
          fechaAlta: unixToShortDate(escena.fechaAlta),
        }));
      }
    });
  }

  fetchPacientesSelect() {
    this.apiService.getPacientes().subscribe((response: ApiResponse) => {
      if (response.ok && response.data) {
        this.pacientes = response.data.map((paciente: any) => ({
          label: paciente.nombre,
          value: paciente.id,
        }));
      }
    });
  }

  onCreateSubmit(): void {
    if (this.isModalEditar) {
      this.apiService
        .updateEscena(this.selectedIdEscena!, this.crearEscenaForm.value)
        .subscribe({
          next: () => {
            this.fetchEscenas();
            this.ModalCrearExpVisible = false;
          },
        });
    } else {
      this.apiService.createEscena(this.crearEscenaForm.value).subscribe({
        next: (response: ApiResponse) => {
          let idEscenaCreada = response.data.id || 0;

          if (
            this.crearEscenaForm.value.fotos &&
            this.crearEscenaForm.value.fotos.length > 0
          ) {
            this.crearEscenaForm.value.fotos.forEach((data: any) => {
              const formData = new FormData();
              formData.append('archivo', data.file);
              if (data.retos) {
                formData.append('retos', JSON.stringify(data.retos));
              }
              console.log(data);
              this.apiService.uploadFiles(formData, idEscenaCreada).subscribe({
                next: (response: any) => {
                  console.log('Archivo subido correctamente:', response);
                },
              });
            });
          }
          this.fetchEscenas();
          this.ModalCrearExpVisible = false;
          this.showToast('Elemento creado');
        },
      });
    }
  }

  eliminarEscena() {
    if (this.selectedIdEscena) {
      this.apiService.deleteEscena(this.selectedIdEscena).subscribe({
        next: () => {
          this.selectedIdEscena = null;
          this.fetchEscenas();
          this.ModalEliminarVisible = false;
          this.showToast('Elemento eliminado');
        },
      });
    }
  }

  crearExperiencia() {
    if (this.iniciarEscenaForm.valid) {
      const experienciaData = {
        duracion: 0,
        fechaAlta: getCurrentDayUnix(),
        estresInicial: 0,
        estresFinal: 0,
        id_escena: this.selectedIdEscena,
        id_paciente: this.iniciarEscenaForm.value.idPaciente,
      };
      this.apiService.createExperiencia(experienciaData).subscribe({
        next: (response: ApiResponse) => {
          this.createdExperienciaId = response.data.id;
          this.router.navigate(['/play'], {
            queryParams: {
              idEscena: this.selectedIdEscena,
              idExperiencia: this.createdExperienciaId,
            },
          });
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

  showDialogCrearExp() {
    this.crearEscenaForm.reset({
      titulo: '',
      fechaAlta: getCurrentDayUnix(),
      descripcion: '',
      fotos: [],
    });
    this.selectedIdEscena = null;
    this.ModalCrearExpVisible = true;
  }

  showDialogIniciarExp() {
    this.ModalIniciarExpVisible = true;
  }
  showDialogEliminarExp() {
    this.ModalEliminarVisible = true;
  }
}
