import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly API_URL = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(userData: Omit<User, 'id' | 'userType' | 'createdAt'>): Observable<boolean> {
    return this.http.get<User[]>(this.API_URL).pipe(
      switchMap(users => {
        const userExists = users.some(u => u.email === userData.email);
        if (userExists) {
          console.error('Registration error: Email already in use');
          return of(false);
        }

        return from(bcrypt.hash(userData.password, 10)).pipe(
          switchMap(hashedPassword => {
            const newUser: User = {
              ...userData,
              password: hashedPassword,
              id: crypto.randomUUID(),
              userType: 'particular',
              createdAt: new Date().toISOString(),
              points: 0 
            };

            return this.http.post(this.API_URL, newUser).pipe(
              map(() => true),
              catchError(error => {
                console.error('Registration error:', error);
                return of(false);
              })
            );
          })
        );
      })
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(this.API_URL).pipe(
      switchMap(users => {
        const user = users.find(u => u.email === email);
        if (!user) {
          return of(false);
        }

        return from(bcrypt.compare(password, user.password)).pipe(
          map(isMatch => {
            if (isMatch) {
              this.currentUserSubject.next(user);
              localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
              return true;
            }
            return false;
          }),
          catchError(error => {
            console.error('Login error:', error);
            return of(false);
          })
        );
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/login']);
  }

  removeAccount(): Observable<boolean> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return of(false);

    return this.http.delete(`${this.API_URL}/${currentUser.id}`).pipe(
      map(() => {
        this.logout();
        return true;
      }),
      catchError(error => {
        console.error('Remove account error:', error);
        return of(false);
      })
    );
  }

  updateProfile(updatedData: Partial<Omit<User, 'id' | 'userType' | 'createdAt'>>): Observable<boolean> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return of(false);

    const updatedUser: User = { ...currentUser, ...updatedData };
    return this.http.put(`${this.API_URL}/${currentUser.id}`, updatedUser).pipe(
      map(() => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
        return true;
      }),
      catchError(error => {
        console.error('Update profile error:', error);
        return of(false);
      })
    );
  }

  addPoints(userId: string, points: number): Observable<void> {
    return this.http.get<User>(`${this.API_URL}/${userId}`).pipe(
      switchMap(user => {
        if (user) {
          user.points = (user.points || 0) + points;
          return this.http.put(`${this.API_URL}/${userId}`, user).pipe(
            map(() => {
              if (this.currentUserSubject.value?.id === userId) {
                this.currentUserSubject.next(user);
                localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
              }
            }),
            catchError(error => {
              console.error('Add points error:', error);
              return of(undefined);
            })
          );
        }
        return of(undefined);
      })
    );
  }

  convertPoints(userId: string, points: number): Observable<{ success: boolean, voucher: string }> {
    return this.http.get<User>(`${this.API_URL}/${userId}`).pipe(
      switchMap(user => {
        if (user) {
          let voucher = '';
          if (points >= 500) {
            voucher = 'bon d\'achat de 350 Dh';
            points -= 500;
          } else if (points >= 200) {
            voucher = 'bon d\'achat de 120 Dh';
            points -= 200;
          } else if (points >= 100) {
            voucher = 'bon d\'achat de 50 Dh';
            points -= 100;
          } else {
            return of({ success: false, voucher: '' });
          }
          user.points = points;
          return this.http.put(`${this.API_URL}/${userId}`, user).pipe(
            map(() => {
              if (this.currentUserSubject.value?.id === userId) {
                this.currentUserSubject.next(user);
                localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
              }
              return { success: true, voucher };
            }),
            catchError(error => {
              console.error('Convert points error:', error);
              return of({ success: false, voucher: '' });
            })
          );
        }
        return of({ success: false, voucher: '' });
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL).pipe(
      map(users => users ?? []),
      catchError(error => {
        console.error('Get users error:', error);
        return of([]);
      })
    );
  }
}
