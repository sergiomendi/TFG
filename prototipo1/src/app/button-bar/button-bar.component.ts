import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrl: './button-bar.component.css'
})
export class ButtonBarComponent {
  @Output() changeImage = new EventEmitter<string>();

  nextImage() {
    this.changeImage.emit('next');
  }

  previousImage() {
    this.changeImage.emit('previous');
  }
}
