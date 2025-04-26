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
  files: File[] = []; // Array para almacenar los nombres de los archivos
  retos: { id: number; value: string }[] = [{ id: 0, value: '' }];
  nextId: number = 1;

  totalSize: number = 0;
  totalSizePercent: number = 0;

  @ViewChild('dialogRetos') dialogRetos: Dialog | undefined;

  onChange = (files: File[]) => {};
  onTouched = () => {};

  constructor(private apiService: ApiService) {}

  writeValue(value: string[]): void {
    if (value && value.length > 0) {
      this.apiService.getFiles(value).subscribe({
        next: (data: Blob[]) => {
          this.files = data.map((blob: Blob, index: number) => {
            return new File([blob], value[index], { type: blob.type });
          });
          console.log('Files:', this.files);
          this.onChange(this.files);
        },
        error: (err) => {
          console.error('Error fetching files:', err);
        },
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
    const uploadedFiles = event.currentFiles;
    this.files = [...this.files, ...uploadedFiles];
    this.onChange(this.files);
  }

  onFileRemove(fileName: string): void {
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
