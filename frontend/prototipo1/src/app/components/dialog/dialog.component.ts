import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, NgIf } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'mi-dialog',
  imports: [
    NgIf,
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
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() styleClass: Dialog['style'] = '';
  @Input() onSaveProp: () => void = () => {};
  @Output() save = new EventEmitter<void>();

  onSave() {
    this.onSaveProp();
    this.save.emit();
  }
  constructor() {}

  handleHide() {
    this.visibleChange.emit(false);
  }
}
