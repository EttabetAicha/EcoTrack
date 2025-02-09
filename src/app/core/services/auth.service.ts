import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.interface';
import * as bcrypt from 'bcryptjs';
import { CollectionRequest } from '../models/CollectionRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly API_URL = 'http://localhost:3000/users';
  private readonly REQUESTS_API_URL = 'http://localhost:3000/collections';


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



  calculatePoints(wasteTypes: string[], weight: number): number {
    const pointsPerKg: { [key: string]: number } = {
      'plastique': 2,
      'verre': 1,
      'papier': 1,
      'metal': 5
    };

    return wasteTypes.reduce((total, type) => {
      return total + ((pointsPerKg[type] || 0) * weight);
    }, 0);
  }

  convertPoints(
    points: number,
    collectionRequest: CollectionRequest
  ): Observable<{ collectionRequest: CollectionRequest; voucher: string }> {

    const conversionRates: Record<number, string> = {
      100: '50 Dh',
      200: '120 Dh',
      500: '350 Dh'
    };

    if (!(points in conversionRates)) {
      return throwError(() => new Error('Invalid points amount. Must be 100, 200, or 500 points.'));
    }


    if (collectionRequest && collectionRequest.points !== undefined) {
      console.log(collectionRequest.points);
    } else {
      console.log('Collection request or points property is undefined');
    }

    const updatedCollectionRequest = {
      ...collectionRequest,
      points: (collectionRequest.points || 0) - points
    };

    return this.http.put<CollectionRequest>(`${this.REQUESTS_API_URL}/${collectionRequest.id}`, updatedCollectionRequest).pipe(
      map(response => {
        console.log(` Points converted: -${points}, New Balance: ${response.points}`);
        return {
          collectionRequest: response,
          voucher: conversionRates[points]
        };
      }),
      catchError(error => {
        console.error(' Points conversion error:', error);
        return throwError(() => error);
      })
    );
  }

  private getCurrentCollectionRequest(): Observable<CollectionRequest | null> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return of(null);
    }
    return this.http.get<CollectionRequest[]>(`${this.REQUESTS_API_URL}?userId=${currentUser.id}`).pipe(
      map(requests => requests.find(request => request.status === 'pending') || null),
      catchError(error => {
        console.error('Get collection request error:', error);
        return throwError(() => error);
      })
    );
  }

addPointsAfterCollection(userId: string, wasteTypes: string[], weight: number): Observable<User> {
  const pointsToAdd = this.calculatePoints(wasteTypes, weight);

  return this.getUserById(userId).pipe(
    switchMap(user => {
      if (!user) {
        return throwError(() => new Error('User not found'));
      }

      const updatedUser = {
        ...user,
        points: (user.points || 0) + pointsToAdd
      };

      return this.http.put<User>(`${this.API_URL}/users/${userId}`, updatedUser);
    }),
    catchError(error => {
      console.error('Add points error:', error);
      return throwError(() => error);
    })
  );
}

private getUserById(userId: string): Observable<User | null> {
  return this.http.get<User>(`${this.API_URL}/${userId}`).pipe(
    map(user => user || null),
    catchError(error => {
      console.error('Get user error:', error);
      return throwError(() => error);
    })
  );
}}

