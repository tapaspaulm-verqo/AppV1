import { Routes } from '@angular/router';
import { ClientSignupComponent } from './pages/client-signup/client-signup.component';
import { FreelancerSignupComponent } from './pages/freelancer-signup/freelancer-signup.component';
import { HomeComponent } from './pages/home/home.component';
import { JobsComponent } from './pages/jobs/jobs.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'signup/freelancer', component: FreelancerSignupComponent },
  { path: 'signup/client', component: ClientSignupComponent },
  { path: '**', redirectTo: '' },
];
