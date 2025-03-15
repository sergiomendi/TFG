import { Component } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'modal-crear-escena-content',
  standalone: true,
  imports: [TextareaModule, InputTextModule],
  templateUrl: './modal-crear-escena.component.html',
})
export class ModalCrearEscenaComponent {}
