import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { DashboardLayoutComponent } from '../layout/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DashboardLayoutComponent, RouterModule],
  templateUrl:'./dashboard.component.html',
})
export class DashboardComponent {
  isSidebarOpen = true;
}
