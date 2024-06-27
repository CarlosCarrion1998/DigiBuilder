import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DigimonImageService {
  private apiUrl = '';

  constructor(private http: HttpClient) {}

  getImage(codigo: string): Observable<any> {
    this.apiUrl = "http://localhost:8080/api/digimon/image?codigo=" + codigo;
    return this.http.get<any>(this.apiUrl).pipe(
      shareReplay()
    );
}
}
