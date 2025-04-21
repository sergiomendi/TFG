import { Component, Input, SimpleChanges } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ApiService } from '../../../services/api.service';
import { ApiResponse } from '../../../models/api-respuesta';
import { unixToShortDate } from '../../../helpers/time';

@Component({
  selector: 'modal-eventos',
  standalone: true,
  templateUrl: './modal-eventos.component.html',
  imports: [TextareaModule, InputTextModule],
})
export class ModalEventosComponent {
  @Input() idExp: number | null = null;
  @Input() expName: string = '';

  events: string = '';
  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idExp'] && changes['idExp'].currentValue) {
      this.fetchEventos();
    }
  }

  fetchEventos() {
    if (this.idExp === null) return;

    this.apiService.getEventosByExperienciaId(this.idExp).subscribe({
      next: (response: ApiResponse) => {
        if (response.ok) {
          this.events = response.data
            .map((exp: any) => ({
              fecha: unixToShortDate(exp.fecha),
              tipo: exp.tipo,
            }))
            .map((exp: any) => JSON.stringify(exp))
            .join(', ');
        }
      },
    });
  }
}
