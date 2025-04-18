export class Paciente {
  fechaAlta: number;
  nombre: string;
  comentarios: string;

  constructor(fechaAlta: number, titulo: string, comentarios: string) {
    this.fechaAlta = fechaAlta;
    this.nombre = titulo;
    this.comentarios = comentarios;
  }
}
