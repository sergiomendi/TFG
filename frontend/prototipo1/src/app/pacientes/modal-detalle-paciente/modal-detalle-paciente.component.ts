import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import {
  MiTablaComponent,
  TableColumn,
} from '../../components/table/mi-tabla.component';
import { faFaceSmile, faEye } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MiDialogComponent } from '../../components/dialog/dialog.component';
import { Dialog } from 'primeng/dialog';
import { RegistroExperiencia } from '../../models/registro-experiencia';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/api-respuesta';
import { unixToShortDate } from '../../helpers/time';
import { ModalEventosComponent } from './modal-eventos/modal-eventos.component';

@Component({
  selector: 'modal-detalle-paciente',
  standalone: true,
  templateUrl: './modal-detalle-paciente.component.html',
  imports: [
    MiTablaComponent,
    FaIconComponent,
    MiDialogComponent,
    ModalEventosComponent,
  ],
})
export class ModalDetallePacienteComponent {
  @Input() idPaciente: number | null = 0;
  @ViewChild('dialogDetalleExperiencia') dialogDetalleExperiencia:
    | Dialog
    | undefined;

  faFaceSmile = faFaceSmile;
  faEye = faEye;

  expPacientesColumns: TableColumn[] = [];
  experiencias: RegistroExperiencia[] = [];

  idSelectedExp: number | null = null;
  nombreSelectedExp: string = '';

  constructor(private apiService: ApiService) {
    this.expPacientesColumns = [
      { field: 'fechaAlta', header: 'Fecha de alta' },
      { field: 'duracion', header: 'Duración (min)' },
      { field: 'accion1', header: 'Ansiedad Inicio', width: '15%' },
      { field: 'accion2', header: 'Ansiedad Final', width: '15%' },
      { field: 'accion3', header: 'Ansiedad Media', width: '15%' },
      { field: 'accion4', header: '', width: '10%' },
    ];
  }

  fetchExperiencias() {
    this.apiService.getExperienciasByPacienteId(this.idPaciente).subscribe({
      next: (response: ApiResponse) => {
        if (response.ok) {
          this.experiencias = response.data.map((exp: any) => ({
            ...exp,
            fechaAlta: unixToShortDate(exp.fechaAlta),
          }));
        }
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idPaciente'] && changes['idPaciente'].currentValue) {
      this.fetchExperiencias();
    }
  }

  showDialogDetalleExp(id: number, nombre: string) {
    if (this.dialogDetalleExperiencia) {
      this.dialogDetalleExperiencia.visible = true;
      this.idSelectedExp = id;
    }
  }
}
