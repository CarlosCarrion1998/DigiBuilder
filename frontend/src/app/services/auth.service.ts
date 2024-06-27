import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../entity/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/data/user'; // Reemplaza con tu URL de backend

  private user: User | null = null;

  constructor(private http: HttpClient) { }

  login(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?username=${username}`);
  }

  setUser(user: User) {
    this.user = user;
  }

  getUser(): User | null {
    return this.user;
  }
}
