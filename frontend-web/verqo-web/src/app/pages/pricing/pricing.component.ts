import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Fee numbers here are exactly the ones in the business plan / home page
 * copy: freelancers pay a fixed 5%, clients pay 10% Standard or 5% on
 * Business Plus, no subscription or registration fee. The GST note is a
 * plain-language summary of Section 20 (freelancer's own GST, separate
 * from Verqo's fee) — no invented thresholds or figures.
 */
@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero container">
      <p class="badge">Pricing</p>
      <h1>One fixed fee. No subscriptions. No surprises.</h1>
      <p class="subhead">
        Verqo charges a simple, transparent fee on the work that actually happens —
        never a fee to join, list a job, or keep your profile active.
      </p>
    </section>

    <section class="section">
      <div class="container grid-2">
        <div class="card plan-card">
          <p class="badge">Freelancers</p>
          <p class="text-data plan-figure">5%</p>
          <h3>One fixed fee, always</h3>
          <p class="plan-copy">
            You keep 95% of every payment. The fee is the same whether you're taking on your
            first ₹5,000 fix or a six-figure retainer — no tiers, no negotiation.
          </p>
          <a routerLink="/signup/freelancer" class="btn btn-primary">Join as a freelancer</a>
        </div>
        <div class="card plan-card">
          <p class="badge">Businesses</p>
          <p class="text-data plan-figure">10% / 5%</p>
          <h3>Standard or Business Plus</h3>
          <p class="plan-copy">
            The Standard plan charges 10% on contract value. Business Plus brings that down to
            5% for teams hiring at scale through Verqo.
          </p>
          <a routerLink="/signup/client" class="btn btn-secondary">Hire talent</a>
        </div>
      </div>
    </section>

    <section class="section included-section">
      <div class="container">
        <h2>What's included, at both fees</h2>
        <div class="grid-3">
          <div class="card">
            <h4>Identity verification</h4>
            <p>PAN, Aadhaar and EPF active-status checks on every freelancer profile.</p>
          </div>
          <div class="card">
            <h4>Escrow-protected milestones</h4>
            <p>Client funds sit in escrow before work starts, and only release on approval.</p>
          </div>
          <div class="card">
            <h4>Direct payouts</h4>
            <p>UPI, IMPS or NEFT straight to the freelancer's verified bank account.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card gst-note">
          <p class="badge">A note on GST</p>
          <p class="plan-copy">
            Verqo's fee is charged on your contract value. If you're GST-registered, GST on your
            own professional fee is a separate line — it's your invoice to the client, not
            Verqo's fee, and it doesn't change what Verqo charges. Most freelancers earning
            below the GST registration threshold won't need to charge it at all.
          </p>
        </div>
      </div>
    </section>

    <section class="section final-cta">
      <div class="container">
        <h2>No hidden layers. That's the whole fee structure.</h2>
        <div class="cta-row">
          <a routerLink="/signup/freelancer" class="btn btn-primary">Join as a freelancer</a>
          <a routerLink="/signup/client" class="btn btn-secondary">Hire talent</a>
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
      .grid-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-6);
      }
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-6);
        margin-top: var(--space-8);
      }
      .card {
        padding: var(--space-8);
      }
      .plan-card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .plan-figure {
        font-size: 44px;
        color: var(--accent);
        margin: var(--space-3) 0 var(--space-1);
      }
      .plan-copy {
        color: var(--ink-secondary);
        line-height: 1.6;
        margin-bottom: var(--space-6);
      }
      .plan-card a {
        text-decoration: none;
      }
      .included-section {
        background: var(--surface-200);
      }
      .gst-note {
        background: var(--surface-200);
        border-style: dashed;
      }
      .final-cta {
        text-align: center;
      }
      .final-cta .cta-row {
        display: flex;
        gap: var(--space-4);
        justify-content: center;
        margin-top: var(--space-6);
      }
      .final-cta .cta-row a {
        text-decoration: none;
      }
      @media (max-width: 860px) {
        .grid-2,
        .grid-3 {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class PricingComponent {}
