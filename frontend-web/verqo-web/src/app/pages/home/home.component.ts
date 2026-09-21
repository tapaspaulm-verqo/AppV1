import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Verqo's marketing landing page — this is also the digital-marketing
 * front door, so it carries more sections than a typical app home screen:
 * hero, trust strip, problem/answer/fees, how-it-works, an audience split
 * (freelancer vs business), a trust & verification highlight, a pricing
 * teaser, and a closing CTA band. Every number and claim here comes from
 * the documented business plan (fixed 5% freelancer fee, 10%/5% client
 * fee, PAN/Aadhaar/EPF verification, milestone escrow) — nothing invented.
 */
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
        <a routerLink="/signup/freelancer" class="btn btn-accent">Join as a freelancer</a>
        <a routerLink="/business" class="btn btn-client-outline">Hire talent</a>
      </div>
      <div class="trust-strip">
        <span class="trust-item"><span class="dot"></span>PAN + Aadhaar verified</span>
        <span class="trust-item"><span class="dot"></span>Escrow-protected milestones</span>
        <span class="trust-item"><span class="dot"></span>EPF active-status checked</span>
        <span class="trust-item"><span class="dot"></span>No subscription fees, ever</span>
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
        <div class="section-head">
          <h2>How it works</h2>
          <a routerLink="/how-it-works" class="text-link">See the full walkthrough →</a>
        </div>
        <div class="grid-5">
          <div><strong>1. Agree</strong><p>Scope, milestones and price</p></div>
          <div><strong>2. Fund</strong><p>Client pays into escrow</p></div>
          <div><strong>3. Deliver</strong><p>Freelancer submits the work</p></div>
          <div><strong>4. Approve</strong><p>Or auto-release after the review window</p></div>
          <div><strong>5. Get paid</strong><p>NEFT, IMPS or UPI to the freelancer</p></div>
        </div>
      </div>
    </section>

    <section class="section audience-split">
      <div class="container">
        <h2>Built for both sides of the table</h2>
        <div class="grid-2">
          <div class="card audience-card card-accent-freelancer">
            <p class="badge badge-freelancer">For freelancers</p>
            <h3>Keep 95% of every payment</h3>
            <p class="audience-copy">
              A verified profile, a fixed 5% fee, and money that's already funded before you start
              work. No bidding wars against unverified accounts, no subscription to join.
            </p>
            <a routerLink="/freelancers" class="text-link text-link-freelancer">Why freelancers choose Verqo →</a>
          </div>
          <div class="card audience-card card-accent-client">
            <p class="badge badge-client">For businesses</p>
            <h3>Hire verified talent, pay for approved work</h3>
            <p class="audience-copy">
              Every freelancer's identity is checked before they can apply. Every rupee sits in
              escrow until you approve the milestone — never paid out on trust alone.
            </p>
            <a routerLink="/business" class="text-link text-link-client">Why businesses hire on Verqo →</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section trust-section">
      <div class="container grid-2-uneven">
        <div>
          <p class="badge">Trust &amp; safety</p>
          <h2>Verification and escrow, built in — not bolted on</h2>
          <p class="audience-copy">
            Every freelancer clears identity verification before their profile goes live. Every
            milestone moves through the same protected states, whether it's a ₹5,000 fix or a
            six-figure contract.
          </p>
          <a routerLink="/trust-safety" class="btn btn-secondary">See how verification works</a>
        </div>
        <div class="pill-stack">
          <div class="pill-row"><span class="status-pill status-pill--verified">Verified</span><span>PAN &amp; Aadhaar identity check</span></div>
          <div class="pill-row"><span class="status-pill status-pill--verified">Verified</span><span>EPF active-employment status</span></div>
          <div class="pill-row"><span class="status-pill status-pill--verified">Funded</span><span>Client's milestone payment held in escrow</span></div>
          <div class="pill-row"><span class="status-pill status-pill--review">In review</span><span>Disputed milestones held for manual review</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-dark pricing-teaser">
          <p class="badge badge-on-dark">Pricing</p>
          <h2>One fixed fee. No surprises.</h2>
          <div class="pricing-teaser-row">
            <div>
              <p class="text-data pricing-figure pricing-figure-freelancer">5%</p>
              <p>Fixed fee for every freelancer, on every payment</p>
            </div>
            <div>
              <p class="text-data pricing-figure pricing-figure-client">10%</p>
              <p>Standard client fee — down to 5% on Business Plus</p>
            </div>
          </div>
          <a routerLink="/pricing" class="btn btn-accent">See full pricing →</a>
        </div>
      </div>
    </section>

    <section class="section final-cta">
      <div class="container">
        <h2>Ready to get started?</h2>
        <p class="audience-copy">Join as a verified freelancer, or post a role and hire with escrow protection.</p>
        <div class="cta-row">
          <a routerLink="/signup/freelancer" class="btn btn-accent">Join as a freelancer</a>
          <a routerLink="/signup/client" class="btn btn-client-outline">Hire talent</a>
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
      .trust-strip {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2) var(--space-6);
        margin-top: var(--space-10);
        padding-top: var(--space-6);
        border-top: 1px solid var(--border-subtle);
      }
      .trust-item {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--text-label-size);
        font-weight: 600;
        color: var(--ink-secondary);
      }
      .trust-item .dot {
        width: 6px;
        height: 6px;
        border-radius: var(--radius-full);
        background: var(--accent);
        flex-shrink: 0;
      }
      .problem-answer {
        background: var(--surface-200);
      }
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-6);
      }
      .grid-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-6);
        margin-top: var(--space-8);
      }
      .grid-2-uneven {
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: var(--space-10);
        align-items: center;
      }
      .grid-5 {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: var(--space-6);
        margin-top: var(--space-6);
      }
      .card {
        padding: var(--space-8);
      }
      .section-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      .text-link {
        color: var(--ink);
        font-weight: 600;
        text-decoration: none;
        font-size: var(--text-body-size);
        white-space: nowrap;
      }
      .text-link:hover {
        text-decoration: underline;
      }
      .text-link-freelancer {
        color: var(--accent);
      }
      .text-link-client {
        color: var(--client);
      }
      .audience-card {
        padding-left: calc(var(--space-8) - 3px);
      }
      .audience-card h3 {
        margin-top: var(--space-2);
      }
      .audience-copy {
        color: var(--ink-secondary);
        line-height: 1.6;
      }
      .trust-section {
        background: var(--surface-200);
      }
      .pill-stack {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }
      .pill-row {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        background: var(--surface-100);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: var(--space-4);
      }
      .pill-row span:last-child {
        color: var(--ink);
        font-size: var(--text-body-size);
      }
      .pricing-teaser {
        padding: var(--space-10);
      }
      .badge-on-dark {
        color: var(--silver);
      }
      .pricing-teaser-row {
        display: flex;
        gap: var(--space-12);
        margin: var(--space-6) 0 var(--space-8);
        flex-wrap: wrap;
      }
      .pricing-figure {
        font-size: 40px;
        margin: 0 0 var(--space-1) 0;
      }
      .pricing-figure-freelancer {
        color: var(--accent);
      }
      .pricing-figure-client {
        color: var(--client);
      }
      .pricing-teaser-row p:last-child {
        color: var(--surface-200);
        max-width: 220px;
      }
      .final-cta {
        text-align: center;
      }
      .final-cta .cta-row {
        justify-content: center;
      }
      .final-cta .audience-copy {
        max-width: 480px;
        margin: var(--space-2) auto 0;
      }
      @media (max-width: 860px) {
        .grid-3,
        .grid-5,
        .grid-2 {
          grid-template-columns: 1fr;
        }
        .grid-2-uneven {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent {}
