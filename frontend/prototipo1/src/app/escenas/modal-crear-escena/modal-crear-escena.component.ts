import { Component } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadComponent } from '../../components/fileUpload/mi-file-upload.component';

@Component({
  selector: 'modal-crear-escena-content',
  standalone: true,
  imports: [TextareaModule, InputTextModule, FileUploadComponent],
  templateUrl: './modal-crear-escena.component.html',
})
export class ModalCrearEscenaComponent {}
