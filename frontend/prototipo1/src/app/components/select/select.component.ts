import { Component, Input, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Select, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mi-select',
  standalone: true,
  templateUrl: './select.component.html',
  imports: [
    FormsModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    SelectModule,
  ],
})
export class MiSelectComponent {
  @ViewChild('select') select!: Select;
  @Input() options: any[] = [];
  @Input() expanded: boolean = false;

  optionSelected: any;
  constructor() {}

  ngOnInit() {
    console.log(this.options);
    this.options = this.options.map((option) => ({
      label: option,
      value: option,
    }));
  }
}
