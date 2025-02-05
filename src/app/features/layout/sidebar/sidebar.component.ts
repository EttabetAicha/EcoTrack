// src/app/features/dashboard/components/sidebar/sidebar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div [ngClass]="{'translate-x-0': isOpen, '-translate-x-full': !isOpen}"
         class="fixed inset-y-0 left-0 transform w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out pt-16">
      <nav class="mt-8">
        <a routerLink="/dashboard"
           routerLinkActive="bg-gray-100"
           [routerLinkActiveOptions]="{exact: true}"
           class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
          <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </a>

        <a routerLink="/dashboard/collections"
           routerLinkActive="bg-gray-100"
           class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
          <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Collection Requests</span>
        </a>

        <a routerLink="/dashboard/points"
           routerLinkActive="bg-gray-100"
           class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
          <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Points & Rewards</span>
        </a>
      </nav>
    </div>
  `
})
export class SidebarComponent {
  @Input() isOpen = true;
}
