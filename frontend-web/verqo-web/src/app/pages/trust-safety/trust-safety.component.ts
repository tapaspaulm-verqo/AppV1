import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trust-safety',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero container">
      <p class="badge">Trust &amp; safety</p>
      <h1>Verified, not hyped</h1>
      <p class="subhead">
        Verqo's trust model rests on two things: checking who someone actually is before they can
        work or hire, and never letting money move on trust alone.
      </p>
    </section>

    <section class="section">
      <div class="container">
        <h2>Identity verification</h2>
        <p class="lead">Every freelancer profile clears the same pipeline before it goes live.</p>
        <div class="grid-5">
          <div class="card">
            <span class="status-pill status-pill--verified">Stage 1</span>
            <h4>PAN</h4>
            <p>Format and checksum validated, then checked against the verification service.</p>
          </div>
          <div class="card">
            <span class="status-pill status-pill--verified">Stage 2</span>
            <h4>Aadhaar</h4>
            <p>Checksum-validated. Only the last 4 digits are ever stored — the full number never is.</p>
          </div>
          <div class="card">
            <span class="status-pill status-pill--verified">Stage 3</span>
            <h4>Bank account</h4>
            <p>Confirmed before any payout can be sent, so payouts only ever land where they should.</p>
          </div>
          <div class="card">
            <span class="status-pill status-pill--verified">Stage 4</span>
            <h4>Profile &amp; skills</h4>
            <p>Primary role, experience level and rate band are recorded on the profile.</p>
          </div>
          <div class="card">
            <span class="status-pill status-pill--review">Stage 5</span>
            <h4>EPF status</h4>
            <p>Optional UAN check for active-employment status — routed to manual review where automation can't confirm it.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section escrow-section">
      <div class="container">
        <h2>Escrow-protected milestones</h2>
        <p class="lead">
          Client payments are held in a bank-partnered escrow account, structured under RBI's
          payment aggregator framework — not in Verqo's own account, and not released on trust.
        </p>
        <div class="pill-stack">
          <div class="pill-row"><span class="status-pill status-pill--pending">Unfunded</span><span>Milestone agreed, not yet paid in.</span></div>
          <div class="pill-row"><span class="status-pill status-pill--verified">Funded</span><span>Client's payment is held in escrow before work starts.</span></div>
          <div class="pill-row"><span class="status-pill status-pill--pending">In progress / Submitted</span><span>Freelancer delivers; funds stay protected throughout.</span></div>
          <div class="pill-row"><span class="status-pill status-pill--released">Approved &amp; released</span><span>Client approves — or the review window passes — and funds release.</span></div>
          <div class="pill-row"><span class="status-pill status-pill--review">Disputed</span><span>Client and freelancer disagree; held for manual review instead of auto-releasing.</span></div>
          <div class="pill-row"><span class="status-pill status-pill--failed">Refunded &amp; cancelled</span><span>Contract doesn't proceed; funds return to the client.</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-dark cta-band">
          <h2>Money is sacred. Fee and escrow math stays legible.</h2>
          <p>You should always be able to see exactly where a rupee is — funded, in progress, or paid out — never guess.</p>
          <div class="cta-row">
            <a routerLink="/how-it-works" class="btn btn-accent">See the full walkthrough →</a>
            <a routerLink="/pricing" class="btn btn-secondary">View pricing</a>
          </div>
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
      .lead {
        color: var(--ink-secondary);
        line-height: 1.6;
        max-width: 640px;
        margin: var(--space-2) 0 var(--space-8);
      }
      .grid-5 {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: var(--space-4);
      }
      .card {
        padding: var(--space-6);
      }
      .card h4 {
        margin: var(--space-3) 0 var(--space-1);
      }
      .card p {
        color: var(--ink-secondary);
        font-size: var(--text-label-size);
        line-height: 1.5;
      }
      .escrow-section {
        background: var(--surface-200);
      }
      .pill-stack {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
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
        color: var(--ink-secondary);
        font-size: var(--text-body-size);
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
      .cta-band .cta-row {
        display: flex;
        gap: var(--space-4);
        flex-wrap: wrap;
      }
      .cta-band a {
        text-decoration: none;
      }
      @media (max-width: 900px) {
        .grid-5 {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 560px) {
        .grid-5 {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TrustSafetyComponent {}
