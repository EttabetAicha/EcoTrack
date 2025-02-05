import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly API_URL = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  async register(userData: Omit<User, 'id' | 'userType' | 'createdAt'>): Promise<boolean> {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create new user data with hashed password
      const newUser: User = {
        ...userData,
        password: hashedPassword,
        id: crypto.randomUUID(),
        userType: 'particular',
        createdAt: new Date().toISOString()
      };

      // Send registration data to the backend
      await this.http.post(this.API_URL, newUser).toPromise();

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  // Get all users
  getUsers(): Promise<User[]> {
    return this.http.get<User[]>(this.API_URL).toPromise().then(users => users ?? []);
  }
}
