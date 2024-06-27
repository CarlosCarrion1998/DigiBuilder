import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../entity/card';

@Injectable({
  providedIn: 'root'
})
export class DigimonCardService {

  private url = 'http://localhost:8080/api/data/card';

  constructor(private http: HttpClient) { }

  getAllCards(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getCardByCode(code: string): Observable<any> {
    return this.http.get<any>(this.url + '?cardCode=' + code);
  }

  postCard(card: Card): Observable<any> {
    return this.http.post<any>(this.url, card);
  }
}
