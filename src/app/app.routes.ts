import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LandingPage } from './features/landing-page/landing-page.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  {path:"",component:LandingPage},
  { path: 'register', component: RegisterComponent },
  {path:"login",component:LoginComponent}

];
