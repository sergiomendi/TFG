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
}
