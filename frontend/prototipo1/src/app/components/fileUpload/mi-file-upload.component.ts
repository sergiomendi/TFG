import { Component, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule aquí
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { MiDialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'mi-file-upload',
  templateUrl: './mi-file-upload.component.html',
  standalone: true,
  imports: [
    FileUpload,
    ButtonModule,
    BadgeModule,
    InputText,
    CommonModule,
    HttpClientModule,
    MiDialogComponent,
  ],
})
export class FileUploadComponent {
  files = [];
  retos: { id: number; value: string }[] = [{ id: 0, value: '' }]; // Lista para almacenar los valores de los campos de texto con índices
  nextId: number = 1; // Variable para generar IDs únicos

  totalSize: number = 0;

  totalSizePercent: number = 0;
  @ViewChild('dialogRetos') dialogRetos: Dialog | undefined;

  constructor(private apiService: ApiService) {}

  showDialogRetos() {
    if (this.dialogRetos) {
      this.dialogRetos.visible = true;
    }
  }

  addInput() {
    this.retos.push({ id: this.nextId++, value: '' }); // Añadir un nuevo campo de texto con un ID único
  }

  removeInput(id: number) {
    this.retos = this.retos.filter((reto) => reto.id !== id); // Eliminar un campo de texto por ID
  }

  choose(event: any, callback: any) {
    callback();
  }

  onRemoveTemplatingFile(
    event: any,
    file: any,
    removeFileCallback: any,
    index: any
  ) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onSelectedFiles(event: any) {
    const files = event.currentFiles;
    console.log('Archivos seleccionados:', files);
    this.files = files;

    // Calcular el tamaño total de los archivos seleccionados
    this.files.forEach((file: File) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;

    // Crear el FormData y agregar los archivos con el nombre 'archivo'
    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append('archivo', file); // Cambiado a 'archivo'
    });

    // Llamar al servicio para subir los archivos
    this.apiService.uploadFiles(formData, 'prueba', files[0].name).subscribe({
      next: (response: any) => {
        console.log('Archivos subidos correctamente:', response);
      },
      error: (error) => {
        console.error('Error al subir los archivos:', error);
      },
    });
  }

  uploadEvent(callback: any) {
    callback();
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    // const sizes = this.config.translation.fileSizeTypes;
    // if (bytes === 0) {
    //   return `0 ${sizes[0]}`;
    // }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    // return `${formattedSize} ${sizes[i]}`;
    return '10';
  }
}
