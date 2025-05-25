import { Component, Input, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'mi-select',
  standalone: true,
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MiSelectComponent),
      multi: true,
    },
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    DropdownModule,
  ],
})
export class MiSelectComponent implements ControlValueAccessor, OnInit {
  @Input() options: any[] = [];
  @Input() expanded: boolean = false;

  value: any;

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    // Asegúrate de que las opciones tengan label y value
    this.options = this.options.map((option) => {
      return typeof option === 'object'
        ? option
        : { label: option, value: option };
    });
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Opcional: manejar estado deshabilitado si es necesario
  }

  onValueChange(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
