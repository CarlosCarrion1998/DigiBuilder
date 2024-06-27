import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DigimonService {
  private apiUrl =
    'https://digimoncard.io/api-public/getAllCards.php?sort=name&series=Digimon%20Card%20Game&sortdirection=asc';

  constructor(private http: HttpClient) {}

  getAllCards(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  
}
