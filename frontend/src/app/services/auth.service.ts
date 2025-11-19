import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { TokenService } from './token.service';
import { AuthResponse, LoginRequest, RegisterRequest, User, UpdateProfileRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private currentUserSubject!: BehaviorSubject<User | null>;
  public currentUser$!: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.tokenService.getUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  logout(): void {
    this.tokenService.clear();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  updateProfile(request: UpdateProfileRequest): Observable<any> {
    return this.http.put(`${this.API_URL}/me`, request);
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  isAdmin(): boolean {
    const user = this.tokenService.getUser();
    return user !== null && user.role === 'ADMIN';
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.tokenService.saveToken(response.token);
    const user: User = {
      username: response.username,
      email: response.email,
      role: response.role as 'USER' | 'ADMIN'
    };
    this.tokenService.saveUser(user);
    this.currentUserSubject.next(user);
  }
}
