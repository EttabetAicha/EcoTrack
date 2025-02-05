import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly STORAGE_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor(private router: Router) {
    const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(userData: Omit<User, 'id' | 'userType' | 'createdAt'>): boolean {
    try {
      const users = this.getUsers();

      // Check if email already exists
      if (users.some(user => user.email === userData.email)) {
        throw new Error('Email already exists');
      }

      // Create new user
      const newUser: User = {
        ...userData,
        id: crypto.randomUUID(),
        userType: 'particular',
        createdAt: new Date().toISOString()
      };

      // Add to users array
      users.push(newUser);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  // Login
  login(email: string, password: string): boolean {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Store current user
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Update user profile
  updateProfile(userId: string, userData: Partial<User>): boolean {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

      // Update current user if it's the logged-in user
      if (this.currentUserSubject.value?.id === userId) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
        this.currentUserSubject.next(users[userIndex]);
      }

      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  }

  // Delete account
  deleteAccount(userId: string): boolean {
    try {
      let users = this.getUsers();
      users = users.filter(user => user.id !== userId);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

      if (this.currentUserSubject.value?.id === userId) {
        this.logout();
      }

      return true;
    } catch (error) {
      console.error('Delete account error:', error);
      return false;
    }
  }

  // Helper method to get users from localStorage
  private getUsers(): User[] {
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }
}
