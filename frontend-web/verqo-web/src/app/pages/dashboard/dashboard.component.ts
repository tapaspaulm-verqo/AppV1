import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ClientDashboardComponent } from './client-dashboard.component';
import { FreelancerDashboardComponent } from './freelancer-dashboard.component';

/**
 * One route, two entirely different views — which one renders depends on
 * which profile the logged-in session carries. See AuthController /
 * DashboardController remarks (backend) for why this isn't one shared
 * shape: a Freelancer and a Client are looking at almost entirely
 * different data.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FreelancerDashboardComponent, ClientDashboardComponent],
  template: `
    @if (auth.currentUser()?.role === 'Client') {
      <app-client-dashboard />
    } @else if (auth.currentUser()?.role === 'Freelancer') {
      <app-freelancer-dashboard />
    } @else {
      <section class="container empty-state">
        <p>This account has no Freelancer or Client profile to show a dashboard for.</p>
      </section>
    }
  `,
  styles: [
    `
      .empty-state {
        padding: var(--space-16) var(--space-6);
        color: var(--ink-secondary);
      }
    `,
  ],
})
export class DashboardComponent {
  constructor(readonly auth: AuthService) {}
}
