import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero container">
      <p class="badge">India · Tech freelance marketplace</p>
      <h1>Verified tech talent. Escrow-protected pay.</h1>
      <p class="subhead">
        Verqo connects Indian tech freelancers with businesses, hourly or by project —
        with milestone escrow so every rupee is protected until the work is done.
      </p>
      <div class="cta-row">
        <a routerLink="/signup/freelancer" class="btn btn-primary">Join as a freelancer</a>
        <a routerLink="/signup/client" class="btn btn-secondary">Hire talent</a>
      </div>
    </section>

    <section class="section problem-answer">
      <div class="container grid-3">
        <div class="card">
          <h3>The problem</h3>
          <p>IT services firms keep an estimated 50–80% of a resource's cost. The professional doing the work gets 20–40%.</p>
        </div>
        <div class="card card-dark">
          <h3>Our answer</h3>
          <p>Verified freelancers, escrow-protected milestones, and direct payouts by NEFT, IMPS or UPI.</p>
        </div>
        <div class="card">
          <h3>Simple fees</h3>
          <p>Freelancers pay a fixed 5%. Clients pay 10% (Standard), down to 5% on Business Plus. No registration or subscription fee, ever.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>How it works</h2>
        <div class="grid-5">
          <div><strong>1. Agree</strong><p>Scope, milestones and price</p></div>
          <div><strong>2. Fund</strong><p>Client pays into escrow</p></div>
          <div><strong>3. Deliver</strong><p>Freelancer submits the work</p></div>
          <div><strong>4. Approve</strong><p>Or auto-release after the review window</p></div>
          <div><strong>5. Get paid</strong><p>NEFT, IMPS or UPI to the freelancer</p></div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        padding: 96px 24px 64px;
        max-width: 760px;
      }
      .subhead {
        font-size: 18px;
        color: #444;
        line-height: 1.6;
      }
      .cta-row {
        display: flex;
        gap: 16px;
        margin-top: 32px;
      }
      .cta-row a {
        text-decoration: none;
      }
      .problem-answer {
        background: var(--verqo-silver-light);
      }
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }
      .grid-5 {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 24px;
        margin-top: 24px;
      }
      .card {
        background: var(--verqo-white);
        padding: 28px;
        border-radius: 12px;
      }
      .card-dark {
        background: var(--verqo-black);
        color: var(--verqo-white);
      }
    `,
  ],
})
export class HomeComponent {}
