import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LandingPage } from './features/landing-page/landing-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/profile/profile.component';
import { CollectorComponent } from './features/collector/collector.component';
import { PointsComponent } from './features/points/points.component';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'particular/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'profile', component: ProfileComponent },
      {path:'Collector-request',component:CollectorComponent},
      {path:'points',component:PointsComponent},


    ]
  }
];
