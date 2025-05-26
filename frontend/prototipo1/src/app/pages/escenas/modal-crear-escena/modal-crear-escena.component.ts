import { Component, Input } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadComponent } from '../../../components/fileUpload/mi-file-upload.component';
import { OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ApiResponse } from '../../../models/api-respuesta';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnixToShortDatePipe } from '../../../pipes/unix-to-short-date';

@Component({
  selector: 'modal-crear-escena-content',
  standalone: true,
  imports: [
    TextareaModule,
    InputTextModule,
    FileUploadComponent,
    FormsModule,
    ReactiveFormsModule,
    UnixToShortDatePipe,
  ],
  templateUrl: './modal-crear-escena.component.html',
})
export class ModalCrearEscenaComponent implements OnChanges {
  @Input() id: number | null = null;
  @Input() formGroup!: FormGroup;

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes['id'].currentValue !== null) {
      this.fetchEscenaData();
    }
  }

  private fetchEscenaData(): void {
    this.formGroup.patchValue({
      titulo: '',
      fechaAlta: null,
      descripcion: '',
      fotos: [],
    });
    this.apiService.getEscenaById(this.id).subscribe({
      next: (response: ApiResponse) => {
        if (response.ok) {
          this.apiService.getArchivosPorEscena(this.id || 0).subscribe({
            next: (archivos: any) => {
              if (archivos.length > 0) {
                this.formGroup.patchValue({
                  fotos: archivos,
                });
              }
            },
          });
          this.formGroup.patchValue({
            titulo: response.data.titulo || '',
            fechaAlta: response.data.fechaAlta,
            descripcion: response.data.descripcion || '',
          });
        }
      },
    });
  }
}
