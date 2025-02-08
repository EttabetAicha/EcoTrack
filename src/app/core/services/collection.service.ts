import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, switchMap } from 'rxjs';
import { CollectionRequest } from '../models/CollectionRequest.interface';
import { User } from '../models/user.interface';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private apiUrl = 'http://localhost:3000/collections';
  private uploadUrl = 'http://localhost:3000/upload';

  private http = inject(HttpClient);
  constructor(private authService: AuthService){

  }

  createRequest(request: CollectionRequest): Observable<CollectionRequest> {
    return this.http.post<CollectionRequest>(this.apiUrl, request);
  }

  updateRequest(request: CollectionRequest): Observable<CollectionRequest> {
    return this.http.put<CollectionRequest>(`${this.apiUrl}/${request.id}`, request);
  }

  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRequests(): Observable<CollectionRequest[]> {
    return this.http.get<CollectionRequest[]>(this.apiUrl);
  }

  getRequestsByCity(city: string): Observable<CollectionRequest[]> {
    return this.http.get<CollectionRequest[]>(`${this.apiUrl}?city=${city}`);
  }


  uploadFile(file: File): Observable<{ filePath: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ filePath: string }>(this.uploadUrl, formData);
  }
  // getRequestCountByUser(): Observable<number> {
  //   console.log( this.authService.currentUser$)
  //   return this.authService.currentUser$.pipe(

  //     switchMap(currentUser => {
  //       if (!currentUser) {
  //         return of(0);
  //       }
  //       return this.http.get<CollectionRequest[]>(`${this.apiUrl}?userId=${currentUser.id}`).pipe(
  //         map(requests => requests.length)
  //       );
  //     })
  //   );
  getRequestCountByUser(): Observable<number> {
    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser) {
      return of(0);
    }
    return this.http.get<CollectionRequest[]>(`${this.apiUrl}?userId=${currentUser.id}`).pipe(
      map(requests => requests.filter(request => request.status !== 'validated' && request.status !== 'rejected').length)
    );
  }
    getTotalWeightByUser(): Observable<number> {
      const currentUser = this.authService.currentUserSubject.value;
      if (!currentUser) {
        return of(0);
      }
      return this.http.get<CollectionRequest[]>(`${this.apiUrl}?userId=${currentUser.id}`).pipe(
        map(requests => requests.reduce((total, request) => total + request.estimatedWeight, 0))
      );
    }

  }

