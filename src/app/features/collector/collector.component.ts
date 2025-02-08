import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import * as CollectionActions from '../../state/actions/collectionReq.actions';
import { selectCollectionRequests, selectPendingRequests, selectRequestsByCity } from '../../state/selectors/collectionReq.selectors';
import { CollectionRequest } from '../../core/models/CollectionRequest.interface';
import { MatDialog } from '@angular/material/dialog';
import { CollectionRequestDialogComponent } from './collecto-req-modals/collector-req-modal.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.interface';
import Swal from 'sweetalert2';
import { CollectorReqEditModalComponent } from './collecto-req-modals/collector-req-edit-modal.component';

@Component({
  selector: 'app-collector',
  templateUrl: './collector.component.html',
  imports: [CommonModule]
})
export class CollectorComponent implements OnInit {
  requests$: Observable<CollectionRequest[]>;
  pendingRequests$: Observable<CollectionRequest[]>;
  currentUser$: Observable<User | null>;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.requests$ = this.store.select(selectCollectionRequests);
    this.pendingRequests$ = this.store.select(selectPendingRequests);
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
      this.currentUser$.subscribe(user => {
      console.log('currentUser$', user);
      if (user && user.userType === 'collector') {
        console.log('User is a collector:', user.userType);

        if (user.address) {
          const city = user.address.city;
          console.log(city);
          this.filterRequestsByCity(city);
        } else {
          console.log('User street address is undefined');
        }
      } else {
        console.log('User is not a collector or not logged in');
        this.store.dispatch(CollectionActions.loadRequests());
        this.requests$ = this.store.select(selectCollectionRequests);
        this.pendingRequests$ = this.store.select(selectPendingRequests);
      }
    });
  }
  filterRequestsByCity(city: string): void {
    console.log('Filtering requests by city:', city);
    this.store.dispatch(CollectionActions.loadRequestsByCity({ city }));
    this.requests$ = this.store.select(selectRequestsByCity(city));
    this.pendingRequests$ = this.store.select(selectPendingRequests).pipe(
      map(requests => {
        const filteredRequests = requests.filter(request => request.address.city === city);
        console.log('Filtered pending requests:', filteredRequests);
        return filteredRequests;
      })
    );
  }


  onDelete(id: number): void {
    this.store.dispatch(CollectionActions.deleteRequest({ id }));
  }

  onUpdate(request: CollectionRequest): void {
    this.store.dispatch(CollectionActions.updateRequest({ request }));
  }

  updateRequestStatus(request: CollectionRequest, status: 'pending' | 'occupied' | 'in_progress' | 'validated' | 'rejected'): void {
    this.onUpdate({ ...request, status });
  }

  openCollectionRequestDialog(): void {
    const dialogRef = this.dialog.open(CollectionRequestDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onUpdate(result);
      }
    });
  }
  trackById(index: number, item: any): number {

    return item.id;

  }

  editRequest(request: CollectionRequest): void {
    const dialogRef = this.dialog.open(CollectorReqEditModalComponent, {
      width: '600px',
      data: { request }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onUpdate(result);
      }
    });
  }

  deleteRequest(request: CollectionRequest): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onDelete(request.id!);
        Swal.fire(
          'Deleted!',
          'Your request has been deleted.',
          'success'
        );
      }
    });
  }
}
