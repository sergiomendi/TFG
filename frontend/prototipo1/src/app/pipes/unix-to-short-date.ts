import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixToShortDate',
  standalone: true,
})
export class UnixToShortDatePipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '';
    return new Date(value * 1000).toLocaleDateString(); // Convertir UNIX a fecha corta
  }
}
