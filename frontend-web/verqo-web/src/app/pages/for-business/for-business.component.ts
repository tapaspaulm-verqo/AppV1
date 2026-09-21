import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-for-business',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero container">
      <p class="badge">For businesses</p>
      <h1>Hire verified tech talent. Pay only for approved work.</h1>
      <p class="subhead">
        Post a role hourly or by project, review proposals from identity-verified freelancers,
        and release payment only when the milestone is actually done.
      </p>
      <div class="cta-row">
        <a routerLink="/signup/client" class="btn btn-primary">Hire talent</a>
        <a routerLink="/pricing" class="btn btn-secondary">See pricing</a>
      </div>
    </section>

    <section class="section">
      <div class="container grid-3">
        <div class="card">
          <h3>Verified from day one</h3>
          <p>Every freelancer clears PAN and Aadhaar identity checks before their profile can apply to your role.</p>
        </div>
        <div class="card">
          <h3>Escrow-protected milestones</h3>
          <p>You fund each milestone into escrow up front, and it only releases once you approve the delivered work.</p>
        </div>
        <div class="card">
          <h3>Transparent, fixed fees</h3>
          <p>10% on the Standard plan, down to 5% on Business Plus. No subscription, no listing fee.</p>
        </div>
      </div>
    </section>

    <section class="section steps-section">
      <div class="container">
        <h2>How hiring works</h2>
        <ol class="steps grid-4">
          <li><strong>1. Post a role</strong><p>Describe the work — hourly or project-based, B2B or B2C.</p></li>
          <li><strong>2. Review proposals</strong><p>From freelancers who've already cleared identity verification.</p></li>
          <li><strong>3. Agree milestones</strong><p>Set the scope and price before any money moves.</p></li>
          <li><strong>4. Fund and approve</strong><p>Pay into escrow, then release on approval of each milestone.</p></li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-dark cta-band">
          <h2>Standard or Business Plus</h2>
          <p>
            The Standard plan is built for occasional hiring at 10% platform fee. Business Plus
            brings the fee down to 5% for teams hiring at scale through Verqo, on the same
            escrow-protected model.
          </p>
          <a routerLink="/signup/client" class="btn btn-accent">Hire talent →</a>
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
export class ForBusinessComponent {}
