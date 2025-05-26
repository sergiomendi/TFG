import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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
    const url = `${this.baseUrl}/api/paciente`;
    return this.http.post(url, paciente);
  }

  updatePaciente(id: number, paciente: any): Observable<any> {
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

  getExperienciaById(id: number | null): Observable<any> {
    const url = `${this.baseUrl}/api/experiencia/${id}`;
    return this.http.get(url);
  }

  createExperiencia(experiencia: any): Observable<any> {
    const url = `${this.baseUrl}/api/experiencia`;
    return this.http.post(url, experiencia);
  }

  updateExperiencia(id: number, experiencia: any): Observable<any> {
    const url = `${this.baseUrl}/api/experiencia/${id}`;
    return this.http.put(url, experiencia);
  }

  uploadFiles(formData: FormData, id: number): Observable<any> {
    const url = `${this.baseUrl}/api/upload/${id}`;
    // No pongas Content-Type, Angular lo gestiona
    return this.http.post(url, formData);
  }

  getFiles(files: string[]): Observable<File[]> {
    const url = `${this.baseUrl}/api/upload/getFiles`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<{ ok: boolean; files: { fileName: string; content: string }[] }>(
        url,
        { files },
        { headers }
      )
      .pipe(
        map((response) => {
          if (response.ok && response.files) {
            return response.files.map((file) => {
              // Decodificar el contenido base64 y convertirlo en un Blob
              const byteCharacters = atob(file.content);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);

              // Crear un objeto File
              return new File([byteArray], file.fileName, {
                type: 'application/octet-stream',
              });
            });
          }
          return [];
        })
      );
  }

  getArchivosPorEscena(idEscena: number): Observable<any[]> {
    const url = `${this.baseUrl}/api/archivo/${idEscena}`;

    return this.http
      .get<{
        ok: boolean;
        msg: string;
        data: {
          fileContent: string;
          titulo: string;
          tipo: string;
          retos: string[];
        }[];
      }>(url)
      .pipe(
        map((response) => {
          if (response.ok && response.data) {
            return response.data.map((file) => {
              const byteCharacters = atob(file.fileContent);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const fileObj = new File([byteArray], file.titulo, {
                type: `image/${file.tipo}`,
              });
              // Devuelve retos como array
              return { file: fileObj, retos: file.retos };
            });
          }
          return [];
        })
      );
  }
}
