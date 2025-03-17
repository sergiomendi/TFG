import { NgFor } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
export interface TableColumn {
  header: string;
  field?: TemplateRef<any> | string;
  width?: string;
}

@Component({
  selector: 'mi-tabla',
  templateUrl: './mi-tabla.component.html',
  standalone: true,
  imports: [NgFor, TableModule, IconField, InputIcon, FontAwesomeModule],
})
export class MiTablaComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() filterBy: string = '';
  faMagnifyingGlass = faMagnifyingGlass;
}
