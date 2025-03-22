import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'mi-dialog',
  imports: [
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
    Dialog,
    ButtonModule,
  ],
  standalone: true,
  templateUrl: './dialog.component.html',
})
export class MiDialogComponent {
  @Input() header: string = '';
  @Input() visible: boolean = false;
  @Input() styleClass: Dialog['style'] = '';
  @Output() save = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }
  constructor() {}

  handleHide() {
    this.visible = false;
  }
}
