import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {User} from '../models/user.model';
import {LoginRequest, LoginResponse, RegisterRequest} from '../models/auth.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'cmms_token';
  private readonly userKey = 'cmms_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log(response.roles);
        if (response.accessToken) {
          const user: User = {
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            roles: response.roles,
          };

          this.setToken(response.accessToken);
          this.setUser(user);
          this.currentUserSubject.next(user);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Register
   */
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Si el token está expirado, limpiar y retornar false
    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Obtener token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Guardar token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Guardar usuario
   */
  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Obtener usuario del storage
   */
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  /**
   * Verificar si el token ha expirado
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    } catch (e) {
      return true;
    }
  }

}
