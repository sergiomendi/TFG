export class RegistroExperiencia {
  fecha: string;
  titulo: string;
  tiempoTotal: number;
  int1: number;
  int2: number;
  int3: number;

  constructor(fecha: string, titulo: string) {
    this.fecha = fecha;
    this.titulo = titulo;
    this.tiempoTotal = 30;
    this.int1 = 0;
    this.int2 = 0;
    this.int3 = 0;
  }
}
