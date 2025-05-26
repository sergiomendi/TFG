import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-button-bar',
  standalone: true,
  templateUrl: './button-bar.component.html',
  imports: [NgIf, NgFor, ButtonModule],
})
export class ButtonBarComponent {
  @Input() hideNextArrow: boolean = false;
  @Input() hidePreviousArrow: boolean = false;
  @Input() nivelActual: number = 1;
  levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedLevel: number | null = null;

  @Output() changeImage = new EventEmitter<string>();
  @Output() levelSelected = new EventEmitter<number>();

  previousImage() {
    this.changeImage.emit('previous');
  }

  nextImage() {
    this.changeImage.emit('next');
  }

  selectLevel(level: number) {
    this.selectedLevel = level;
    this.levelSelected.emit(level);
  }

  getColor(index: number): string {
    const startColor = { r: 0, g: 255, b: 0 }; // Verde
    const endColor = { r: 255, g: 0, b: 0 }; // Rojo
    const ratio = index / (this.levels.length - 1);

    const r = Math.round(startColor.r + ratio * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + ratio * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + ratio * (endColor.b - startColor.b));

    // Mezcla con blanco para obtener un color pastel
    const pastelFactor = 0.2; // Ajusta este valor para obtener colores más o menos pasteles
    const pastelR = Math.round(r + pastelFactor * (255 - r));
    const pastelG = Math.round(g + pastelFactor * (255 - g));
    const pastelB = Math.round(b + pastelFactor * (255 - b));

    return `rgb(${pastelR}, ${pastelG}, ${pastelB})`;
  }
}
