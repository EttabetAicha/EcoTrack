import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { DashboardLayoutComponent } from '../layout/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="flex">
        <main [ngClass]="{ 'lg:ml-64': isSidebarOpen, 'lg:ml-0': !isSidebarOpen }" class="pt-16 min-h-screen transition-all flex-1">
          <div class="p-6">
            <div class="max-w-7xl mx-auto">
             hi
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  isSidebarOpen = true;
}
