import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
import { ModalCrearEscenaComponent } from './modal-crear-escena/modal-crear-escena.component';
import {
  MiTablaComponent,
  TableColumn,
} from '../components/table/mi-tabla.component';
import { ApiService } from '../services/api.service';
import { ApiResponse } from '../models/api-respuesta';
import { unixToShortDate } from '../helpers/time';

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
  @ViewChild('dialogIniciar') dialogIniciar: Dialog | undefined;
  @ViewChild('dialogCrear') dialogCrear: Dialog | undefined;
  @ViewChild('dialogEliminar') dialogEliminar: Dialog | undefined;
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
  pacientes: any[] | undefined;

  selectedIdEscena: number | null = null;

  constructor(private router: Router, private apiService: ApiService) {}

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
      if (response.ok) {
        this.pacientes = response.data;
      }
    });
  }

  redirectToPlay() {
    this.router.navigate(['/play']);
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
  showDialogEliminarExp() {
    if (this.dialogEliminar) {
      this.dialogEliminar.visible = true;
    }
  }
}
