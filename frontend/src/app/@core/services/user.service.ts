import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiEndpoint}`;

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/user/authenticate`, { username, password }).pipe(
      map(response => {
        const user = response.data;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      })
    );
  }

  register(user: any): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/users`, user).pipe(
      map(response => response.data)
    );
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/user/${id}`).pipe(
      map(response => response.data)
    );
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/user/${id}`, user).pipe(
      map(response => response.data)
    );
  }
}
