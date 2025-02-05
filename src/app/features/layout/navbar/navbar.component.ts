// src/app/features/dashboard/components/navbar/navbar.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-sm fixed w-full z-10">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <!-- Left side -->
          <div class="flex items-center">
            <button (click)="toggleSidebar.emit()"
                    class="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span class="ml-4 text-xl font-semibold">RecycleHub</span>
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button class="p-2 hover:bg-gray-100 rounded-full">
              <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <!-- User dropdown -->
            <div class="relative" [class.show]="isDropdownOpen">
              <button (click)="toggleDropdown()"
                      class="flex items-center focus:outline-none">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <img *ngIf="user?.profileImage" [src]="user.profileImage"
                       [alt]="user.name" class="h-8 w-8 rounded-full">
                  <svg *ngIf="!user?.profileImage" class="h-4 w-4 text-gray-500"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>

              <!-- Dropdown menu -->
              <div *ngIf="isDropdownOpen"
                   class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <div class="px-4 py-2">
                  <p class="text-sm font-medium text-gray-900">{{user?.name}}</p>
                  <p class="text-sm text-gray-500">{{user?.email}}</p>
                </div>
                <a routerLink="/dashboard/profile"
                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Edit Profile
                </a>
                <button (click)="logout()"
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  @Input() user: any;
  @Output() toggleSidebar = new EventEmitter<void>();

  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    // Implement logout logic
    console.log('Logging out...');
  }
}
