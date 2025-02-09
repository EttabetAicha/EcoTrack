import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.interface';
import { map, take } from 'rxjs/operators';
import { CollectionRequest } from '../../core/models/CollectionRequest.interface';
import { CollectionService } from '../../core/services/collection.service';

export interface RetraitOption {
  points: number;
  voucher: number;
  discount: string;
}

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class PointsComponent implements OnInit, OnDestroy {

  currentPoints: number = 0;
  currentUser$: Observable<User | null>;
  totalPoints$: Observable<number>;
  private subscriptions: Subscription = new Subscription();
  currentMoney: number = 0;
  totalMoney: number = 0; // New property to store the total money

  retraitOptions: RetraitOption[] = [
    { points: 100, voucher: 50, discount: 'Basic Voucher' },
    { points: 200, voucher: 120, discount: 'Standard Voucher' },
    { points: 500, voucher: 350, discount: 'Premium Voucher' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private collectionService: CollectionService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.totalPoints$ = this.collectionService.getRequests().pipe(
      map((requests: CollectionRequest[]) => requests.reduce((total, request) => total + (request.points ?? 0), 0))
    );
  }

  ngOnInit(): void {
    const storedTotalMoney = localStorage.getItem('totalMoney');
    if (storedTotalMoney) {
      this.totalMoney = parseFloat(storedTotalMoney);
    }

    this.subscriptions.add(
      this.totalPoints$.subscribe(totalPoints => {
        this.currentPoints = totalPoints;
        this.currentMoney = this.calculateMoney(totalPoints); 
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  calculateMoney(points: number): number {
    return points * 0.5;
  }

  retraitPoints(option: RetraitOption): void {
    this.collectionService.getCurrentCollectionRequest().subscribe(collectionRequest => {
      if (!collectionRequest) {
        console.log('No collection request found.');
        Swal.fire({
          title: 'Error',
          text: 'Collection request not found. Please select a collection request to redeem points.',
          icon: 'error'
        });
        return;
      }

      if (this.currentPoints < option.points) {
        Swal.fire({
          title: 'Insufficient Points',
          text: `You need at least ${option.points} points to redeem this voucher.`,
          icon: 'warning'
        });
        return;
      }

      Swal.fire({
        title: 'Confirm Points Conversion',
        html: `Convert ${option.points} points for a ${option.voucher} Dh voucher?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.authService.convertPoints(option.points, collectionRequest).subscribe({
            next: (response) => {
              Swal.fire({
                title: 'Success',
                text: 'Your points have been successfully converted to a voucher.',
                icon: 'success'
              });
              this.currentPoints -= option.points;
              this.currentMoney = this.calculateMoney(this.currentPoints); // Update the current money
              this.totalMoney += option.voucher;
              localStorage.setItem('totalMoney', this.totalMoney.toString()); // Store total money in local storage
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
              });
            }
          });
        }
      });
    });
  }

  getVoucherStatus(option: RetraitOption): { disabled: boolean; message: string } {
    let insufficientPoints = true;
    let message = 'Loading...';

    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        insufficientPoints = this.currentPoints < option.points;
        message = insufficientPoints
          ? `Need ${option.points - this.currentPoints} more points`
          : `Available for conversion`;
      } else {
        message = 'User not logged in';
      }
    });

    return {
      disabled: insufficientPoints,
      message: message
    };
  }
}
