// src/app/features/dashboard/layout/dashboard-layout.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  template: `
    <div class="h-screen flex flex-col">
      <!-- Navbar -->
      <nav class="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
        <div class="mx-auto px-6">
          <div class="flex items-center justify-between h-16">
            <!-- Left side -->
            <div class="flex items-center space-x-4">
              <button (click)="toggleSidebar()"
                      class="text-white hover:bg-green-600 p-2 rounded-lg transition-colors">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div class="flex items-center">
                <span class="text-2xl font-bold text-white">RecycleHub</span>
              </div>
            </div>

            <!-- Right side -->
            <div class="flex items-center space-x-6">
              <!-- Notifications -->
              <div class="relative">
                <button class="p-2 text-white hover:bg-green-600 rounded-lg transition-colors">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span class="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
                </button>
              </div>

              <!-- Profile Dropdown -->
              <div class="relative">
                <button (click)="toggleDropdown()"
                        class="flex items-center space-x-3 text-white hover:bg-green-600 p-2 rounded-lg transition-colors">
                  <div class="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <img *ngIf="user.profileImage"
                         [src]="user.profileImage"
                         [alt]="user.name"
                         class="w-8 h-8 rounded-full object-cover">
                    <span *ngIf="!user.profileImage" class="text-white text-lg font-semibold">
                      {{user.name.charAt(0)}}
                    </span>
                  </div>
                  <span class="hidden md:block font-medium">{{user.name}}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div *ngIf="isDropdownOpen"
                     class="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl py-2 z-50">
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-semibold text-gray-900">{{user.name}}</p>
                    <p class="text-sm text-gray-500">{{user.email}}</p>
                  </div>
                  <a href="/dashboard/profile"
                     class="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Edit Profile</span>
                    </div>
                  </a>
                  <button (click)="logout()"
                          class="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Content wrapper -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <aside [class.translate-x-0]="isSidebarOpen"
               [class.-translate-x-full]="!isSidebarOpen"
               class="fixed md:static w-64 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-30">
          <nav class="h-full flex flex-col bg-gray-50">
            <div class="flex-1 overflow-y-auto">
              <div class="px-4 py-4 space-y-2">
                <!-- Dashboard Link -->
                <a href="/dashboard"
                   class="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span class="font-medium">Dashboard</span>
                </a>

                <!-- Collection Requests -->
                <a href="/dashboard/collections"
                   class="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span class="font-medium">Collection Requests</span>
                </a>

                <!-- Points & Rewards -->
                <a href="/dashboard/points"
                   class="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-medium">Points & Rewards</span>
                </a>
              </div>
            </div>

            <!-- User info at bottom -->
            <div class="p-4 border-t border-gray-200">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span class="text-green-700 font-semibold text-lg">{{user.name.charAt(0)}}</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{user.name}}</p>
                  <p class="text-xs text-gray-500">{{user.email}}</p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        <!-- Main content -->
        <main class="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div class="max-w-7xl mx-auto">
            <ng-content></ng-content>
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  isSidebarOpen = true;
  isDropdownOpen = false;

  user = {
    name: 'John Doe',
    email: 'john@example.com',
    profileImage: null
  };

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    console.log('Logging out...');
  }
}
