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
  @ViewChild('fileUpload') fileUpload: FileUpload | undefined;
  files: any[] = []; // Array para almacenar los nombres de los archivos
  retos: { id: number; value: string }[] = [];
  nextId: number = 1;

  totalSize: number = 0;
  totalSizePercent: number = 0;

  @ViewChild('dialogRetos') dialogRetos: Dialog | undefined;

  onTouched = () => {};
  onChange = (_files: File[]) => {};
  constructor() {}

  writeValue(value: any[]): void {
    console.log('writeValue', value);
    if (Array.isArray(value) && value.length > 0) {
      this.files = value.map((file: any) => ({
        file: file.file,
        retos: file.retos,
        objectURL:
          (file.file as any).objectURL || URL.createObjectURL(file.file),
      }));
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  setDisabledState?(_isDisabled: boolean): void {}

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
    const existingNames = new Set(this.files.map((f) => f.file.name));
    const newFiles = event.currentFiles
      .filter((file: File) => !existingNames.has(file.name))
      .map((file: File) => ({
        file,
        retos: [...this.retos],
        objectURL: URL.createObjectURL(file),
      }));
    this.files = [...this.files, ...newFiles];
    this.onChange(this.files);
  }

  onFileRemove(file: File, removeFileCallback: Function): void {
    this.files = this.files.filter((f) => f.name !== file.name);
    this.onChange(this.files);
    if (removeFileCallback) {
      removeFileCallback(file); // Esto elimina el archivo del buffer interno de PrimeNG
    }
  }
  onClearFiles(): void {
    this.files = [];
    this.onChange(this.files);
  }

  choose(event: Event, chooseCallback: Function): void {
    chooseCallback(event);
  }
}
