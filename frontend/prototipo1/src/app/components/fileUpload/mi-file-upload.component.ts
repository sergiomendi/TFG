import { Component, forwardRef, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { MiDialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../models/api-respuesta';

@Component({
  selector: 'mi-file-upload',
  templateUrl: './mi-file-upload.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
  imports: [
    FileUpload,
    ButtonModule,
    BadgeModule,
    InputText,
    CommonModule,
    MiDialogComponent,
    ReactiveFormsModule,
  ],
})
export class FileUploadComponent implements ControlValueAccessor {
  files: any[] = []; // Array para almacenar los nombres de los archivos
  retos: { id: number; value: string }[] = [{ id: 0, value: '' }];
  nextId: number = 1;

  totalSize: number = 0;
  totalSizePercent: number = 0;

  @ViewChild('dialogRetos') dialogRetos: Dialog | undefined;

  onChange = (files: File[]) => {};
  onTouched = () => {};

  constructor() {}

  writeValue(value: any[]): void {
    if (value && value.length > 0) {
      this.files = value.map((file: File) => {
        (file as any).objectURL = URL.createObjectURL(file);
        return file;
      });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  showDialogRetos() {
    if (this.dialogRetos) {
      this.dialogRetos.visible = true;
    }
  }

  addInput() {
    this.retos.push({ id: this.nextId++, value: '' });
  }

  removeInput(id: number) {
    this.retos = this.retos.filter((reto) => reto.id !== id);
  }

  onFileUpload(event: any): void {
    this.files = [...this.files, ...event.currentFiles];
    console.log('Archivos inicializados:', this.files);

    this.onChange(this.files);
  }

  onFileRemove(fileName: string): void {
    this.files = this.files.filter((file) => file.name !== fileName);
    this.onChange(this.files);
  }

  onClearFiles(): void {
    this.files = [];
    this.onChange(this.files);
  }

  choose(event: Event, chooseCallback: Function): void {
    chooseCallback(event);
  }
}
