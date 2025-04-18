import { Component, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule aquí
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { MiDialogComponent } from '../dialog/dialog.component';

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

  constructor() {}

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

  onTemplatedUpload() {}

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file: File) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
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
