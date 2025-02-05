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
      const users = await this.http.get<User[]>(this.API_URL).toPromise();
      const userExists = users?.some(u => u.email === userData.email);
      if (userExists) {
        console.error('Registration error: Email already in use');
        return false;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser: User = {
        ...userData,
        password: hashedPassword,
        id: crypto.randomUUID(),
        userType: 'particular',
        createdAt: new Date().toISOString()
      };
      await this.http.post(this.API_URL, newUser).toPromise();
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const users = await this.http.get<User[]>(this.API_URL).toPromise();
      const user = users?.find(u => u.email === email);
      if (user && await bcrypt.compare(password, user.password)) {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/login']);
  }

  async removeAccount(): Promise<boolean> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return false;

    try {
      await this.http.delete(`${this.API_URL}/${currentUser.id}`).toPromise();
      this.logout();
      return true;
    } catch (error) {
      console.error('Remove account error:', error);
      return false;
    }
  }

  async updateProfile(updatedData: Partial<Omit<User, 'id' | 'userType' | 'createdAt'>>): Promise<boolean> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return false;

    try {
      const updatedUser: User = { ...currentUser, ...updatedData };
      await this.http.put(`${this.API_URL}/${currentUser.id}`, updatedUser).toPromise();
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  }

  getUsers(): Promise<User[]> {
    return this.http.get<User[]>(this.API_URL).toPromise().then(users => users ?? []);
  }
}
