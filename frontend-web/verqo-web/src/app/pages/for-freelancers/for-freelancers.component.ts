import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-for-freelancers',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero container">
      <p class="badge">For freelancers</p>
      <h1>Do the work. Keep 95% of what it's worth.</h1>
      <p class="subhead">
        A verified profile, a fixed 5% fee, and payment that's already sitting in escrow before
        you start. No subscriptions, no bidding against unverified accounts.
      </p>
      <div class="cta-row">
        <a routerLink="/signup/freelancer" class="btn btn-primary">Join as a freelancer</a>
        <a routerLink="/jobs" class="btn btn-secondary">Browse open roles</a>
      </div>
    </section>

    <section class="section">
      <div class="container grid-3">
        <div class="card">
          <h3>Fixed 5% fee</h3>
          <p>The same rate on every contract, from your first small fix to a long-term retainer. No tiers to climb.</p>
        </div>
        <div class="card">
          <h3>Paid from escrow</h3>
          <p>Clients fund each milestone before you start work. You're never chasing payment for work already delivered.</p>
        </div>
        <div class="card">
          <h3>Direct to your bank</h3>
          <p>Payouts go straight to your verified account by UPI, IMPS or NEFT — no intermediary wallet.</p>
        </div>
      </div>
    </section>

    <section class="section steps-section">
      <div class="container">
        <h2>Getting started</h2>
        <ol class="steps grid-4">
          <li><strong>1. Create your profile</strong><p>Tell us your primary role and set up your account.</p></li>
          <li><strong>2. Get verified</strong><p>PAN and Aadhaar are validated automatically; EPF status is optional.</p></li>
          <li><strong>3. Apply to roles</strong><p>Browse open jobs and submit proposals at your rate.</p></li>
          <li><strong>4. Deliver and get paid</strong><p>Work against funded milestones and get paid on approval.</p></li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-dark cta-band">
          <h2>Rate bands that match your experience</h2>
          <p>
            Verqo places roles into experience levels — Junior, Mid, Senior and Expert — and rate
            bands from Standard through Premium, so your profile is matched against work at the
            right level.
          </p>
          <a routerLink="/signup/freelancer" class="btn btn-accent">Join as a freelancer →</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        padding: var(--space-16) var(--space-6) var(--space-10);
        max-width: 760px;
      }
      .subhead {
        font-size: 18px;
        color: var(--ink-secondary);
        line-height: 1.6;
      }
      .cta-row {
        display: flex;
        gap: var(--space-4);
        margin-top: var(--space-8);
        flex-wrap: wrap;
      }
      .cta-row a {
        text-decoration: none;
      }
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-6);
      }
      .card {
        padding: var(--space-8);
      }
      .card p {
        color: var(--ink-secondary);
        line-height: 1.6;
      }
      .steps-section {
        background: var(--surface-200);
      }
      .steps {
        list-style: none;
        padding: 0;
        margin: var(--space-8) 0 0;
      }
      .grid-4 {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-6);
      }
      .steps li p {
        margin-top: var(--space-2);
        color: var(--ink-secondary);
        line-height: 1.5;
      }
      .cta-band {
        padding: var(--space-10);
      }
      .cta-band p {
        color: var(--surface-200);
        line-height: 1.6;
        max-width: 560px;
        margin: var(--space-4) 0 var(--space-6);
      }
      .cta-band a {
        text-decoration: none;
      }
      @media (max-width: 860px) {
        .grid-3,
        .grid-4 {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 560px) {
        .grid-3,
        .grid-4 {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ForFreelancersComponent {}
