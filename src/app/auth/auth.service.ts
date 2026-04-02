import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(username: string, password: string) {
    return this.http.post<any>(this.apiUrl + '/login', { username, password });
  }

  register(username: string, email: string, password: string) {
    return this.http.post(this.apiUrl + '/register', {
      username, email, password
    }, { responseType: 'text' });
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  saveRole(role: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('role', role);
    }
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
  }

  getRole(): string | null {
    const role = isPlatformBrowser(this.platformId) ? localStorage.getItem('role') : null;
    return role ? role.replace('ROLE_', '') : null;
  }

  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/auth/login']);
  }

  saveUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): any | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUsername(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).username;
    }
    return null;
  }

  getUserId(): number | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    const user = JSON.parse(userJson);
    return user?.id || null;
  }
}
