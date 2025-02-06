import { Component } from '@angular/core';
import {  CommonModule } from '@angular/common';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { DashboardLayoutComponent } from "../layout/navbar/navbar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DashboardLayoutComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      <app-sidebar></app-sidebar>
      <main [ngClass]="{ 'lg:ml-64': isSidebarOpen, 'lg:ml-0': !isSidebarOpen }" class="pt-16 min-h-screen transition-all">
        <div class="p-6">
          <div class="max-w-7xl mx-auto">
            <ng-content></ng-content>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class DashboardComponent {
  isSidebarOpen = true;
}
