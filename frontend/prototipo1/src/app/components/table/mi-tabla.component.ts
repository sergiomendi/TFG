import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { InputText } from 'primeng/inputtext';
export interface TableColumn {
  header: string;
  field: string;
  width?: string;
}

@Component({
  selector: 'mi-tabla',
  templateUrl: './mi-tabla.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,
    TableModule,
    IconField,
    InputIcon,
    InputText,
    FontAwesomeModule,
  ],
})
export class MiTablaComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() filterBy: string = '';
  faMagnifyingGlass = faMagnifyingGlass;

  @ContentChild('accion1Template') accion1Template!: TemplateRef<any> | null;
  @ContentChild('accion2Template') accion2Template!: TemplateRef<any> | null;
  @ContentChild('accion3Template') accion3Template!: TemplateRef<any> | null;
  @ContentChild('accion4Template') accion4Template!: TemplateRef<any> | null;
  @ContentChild('captionTemplate') captionTemplate!: TemplateRef<any> | null;
}
