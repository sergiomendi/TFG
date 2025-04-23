import { Component, Input } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadComponent } from '../../components/fileUpload/mi-file-upload.component';
import { OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/api-respuesta';
import { getCurrentDayUnix, unixToShortDate } from '../../helpers/time';

@Component({
  selector: 'modal-crear-escena-content',
  standalone: true,
  imports: [TextareaModule, InputTextModule, FileUploadComponent],
  templateUrl: './modal-crear-escena.component.html',
})
export class ModalCrearEscenaComponent implements OnChanges {
  @Input() id: number | null = null;

  titulo: string = '';
  descripcion: string = '';
  fecha: string = getCurrentDayUnix().toString();

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes['id'].currentValue !== null) {
      this.fetchEscenaData();
    }
  }

  private fetchEscenaData(): void {
    this.apiService.getEscenaById(this.id).subscribe({
      next: (response: ApiResponse) => {
        if (response.ok) {
          this.titulo = response.data.titulo || '';
          this.descripcion = response.data.descripcion || '';
          this.fecha = response.data.fechaAlta
            ? unixToShortDate(response.data.fechaAlta)
            : '';
        }
      },
    });
  }
}
