import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPacienteById(id: number): Observable<any> {
    const url = `${this.baseUrl}/api/paciente/${id}`;
    return this.http.get(url);
  }

  getPacientes(): Observable<any> {
    const url = `${this.baseUrl}/api/paciente`;
    return this.http.get(url);
  }

  createPaciente(paciente: any): Observable<any> {
    console.log('Paciente:', paciente);
    const url = `${this.baseUrl}/api/paciente`;
    return this.http.post(url, paciente);
  }

  updatePaciente(id: number, paciente: any): Observable<any> {
    console.log('Paciente:', paciente);
    const url = `${this.baseUrl}/api/paciente/${id}`;
    return this.http.put(url, paciente);
  }

  deletePaciente(id: number): Observable<any> {
    const url = `${this.baseUrl}/api/paciente/${id}`;
    return this.http.delete(url);
  }

  getExperienciasByPacienteId(id: number | null): Observable<any> {
    const url = `${this.baseUrl}/api/experiencia/paciente/${id}`;
    return this.http.get(url);
  }

  getEventosByExperienciaId(id: number | null): Observable<any> {
    const url = `${this.baseUrl}/api/evento/experiencia/${id}`;
    return this.http.get(url);
  }

  getEscenas(): Observable<any> {
    const url = `${this.baseUrl}/api/escena`;
    return this.http.get(url);
  }

  getEscenaById(id: number | null): Observable<any> {
    const url = `${this.baseUrl}/api/escena/${id}`;
    return this.http.get(url);
  }

  createEscena(escena: any): Observable<any> {
    console.log('Escena:', escena);
    const url = `${this.baseUrl}/api/escena`;
    return this.http.post(url, escena);
  }
  updateEscena(id: number, escena: any): Observable<any> {
    const url = `${this.baseUrl}/api/escena/${id}`;
    return this.http.put(url, escena);
  }
  deleteEscena(id: number): Observable<any> {
    const url = `${this.baseUrl}/api/escena/${id}`;
    return this.http.delete(url);
  }

  createExperiencia(experiencia: any): Observable<any> {
    const url = `${this.baseUrl}/api/experiencia`;
    return this.http.post(url, experiencia);
  }

  updateExperiencia(id: number, experiencia: any): Observable<any> {
    const url = `${this.baseUrl}/api/experiencia/${id}`;
    return this.http.put(url, experiencia);
  }

  uploadFiles(formData: FormData, tipo: string, id: string): Observable<any> {
    console.log('LLAMADA A LA API DE SUBIDA DE ARCHIVOS', formData);
    const url = `${this.baseUrl}/api/upload/${tipo}/${id}`; // Incluye tipo e id en la URL
    const headers = new HttpHeaders(); // No es necesario establecer enctype aquí
    return this.http.post(url, formData, { headers });
  }
}
