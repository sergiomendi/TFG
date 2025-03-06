export class Paciente {
  fechaAlta: Date;
  nombre: string;

  constructor(fechaAlta: Date, titulo: string) {
    this.fechaAlta = fechaAlta;
    this.nombre = titulo;
  }
}
