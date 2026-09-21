import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * The milestone list below mirrors Verqo.Domain.Enums.MilestoneState exactly
 * (Unfunded/Funded/InProgress/Submitted/ApprovedReleased, with
 * Disputed/RefundedCancelled as the two off-ramps) — described in plain
 * brand-voice language ("name the state, not the mechanism") rather than
 * the raw enum names. Verification stages mirror VerificationStage.
 */
@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero container">
      <p class="badge">How it works</p>
      <h1>From agreement to payout, every step is protected</h1>
      <p class="subhead">
        Verqo's escrow and verification aren't add-ons — they're the path every contract takes,
        for a ₹5,000 fix or a six-figure engagement.
      </p>
    </section>

    <section class="section">
      <div class="container grid-2">
        <div class="card">
          <p class="badge">For freelancers</p>
          <ol class="steps">
            <li><strong>Get verified.</strong> PAN and Aadhaar are checked automatically; your EPF UAN is checked for active-employment status.</li>
            <li><strong>Apply to work.</strong> Browse open roles and submit a proposal with your rate.</li>
            <li><strong>Agree the contract.</strong> Scope, milestones and price are set before any work starts.</li>
            <li><strong>Deliver against milestones.</strong> Submit your work once the client's payment is already funded in escrow.</li>
            <li><strong>Get paid.</strong> Once approved — or auto-released after the review window — funds move to your bank via UPI, IMPS or NEFT.</li>
          </ol>
        </div>
        <div class="card">
          <p class="badge">For businesses</p>
          <ol class="steps">
            <li><strong>Post a role.</strong> Describe the work, hourly or project-based.</li>
            <li><strong>Review proposals</strong> from freelancers who have already cleared identity verification.</li>
            <li><strong>Agree the contract.</strong> Set milestones and price up front.</li>
            <li><strong>Fund the milestone.</strong> Payment moves into escrow before the freelancer starts — never paid on trust alone.</li>
            <li><strong>Approve and release.</strong> Review the delivered work, then release payment — or raise a dispute if it isn't right.</li>
          </ol>
        </div>
      </div>
    </section>

    <section class="section milestone-section">
      <div class="container">
        <p class="badge">The milestone lifecycle</p>
        <h2>Every milestone moves through the same protected states</h2>
        <div class="milestone-track">
          <div class="milestone-step">
            <span class="status-pill status-pill--pending">Unfunded</span>
            <p>Milestone is agreed but the client hasn't paid in yet.</p>
          </div>
          <div class="milestone-step">
            <span class="status-pill status-pill--verified">Funded</span>
            <p>Client's payment is held in escrow. Work can begin.</p>
          </div>
          <div class="milestone-step">
            <span class="status-pill status-pill--pending">In progress</span>
            <p>Freelancer is doing the work; funds stay protected in escrow.</p>
          </div>
          <div class="milestone-step">
            <span class="status-pill status-pill--pending">Submitted</span>
            <p>Freelancer has delivered and is waiting on review.</p>
          </div>
          <div class="milestone-step">
            <span class="status-pill status-pill--released">Approved &amp; released</span>
            <p>Client approved — or the review window passed — and funds are released.</p>
          </div>
        </div>
        <div class="milestone-branches">
          <div class="pill-row">
            <span class="status-pill status-pill--review">Disputed</span>
            <span>Client and freelancer disagree — held for manual review instead of auto-releasing.</span>
          </div>
          <div class="pill-row">
            <span class="status-pill status-pill--failed">Refunded &amp; cancelled</span>
            <span>Contract doesn't proceed — funds return to the client.</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="badge">Verification pipeline</p>
        <h2>What "verified" means on Verqo</h2>
        <div class="grid-5 verify-grid">
          <div class="card verify-card"><p class="text-label">Stage 1</p><h4>PAN</h4><p>Format and checksum validated, then checked automatically.</p></div>
          <div class="card verify-card"><p class="text-label">Stage 2</p><h4>Aadhaar</h4><p>Checksum-validated; only the last 4 digits are ever stored.</p></div>
          <div class="card verify-card"><p class="text-label">Stage 3</p><h4>Bank account</h4><p>Confirmed before any payout can be sent to it.</p></div>
          <div class="card verify-card"><p class="text-label">Stage 4</p><h4>Profile &amp; skills</h4><p>Your role, experience level and rate band are recorded.</p></div>
          <div class="card verify-card"><p class="text-label">Stage 5</p><h4>EPF status</h4><p>Optional UAN check for active-employment status.</p></div>
        </div>
      </div>
    </section>

    <section class="section final-cta">
      <div class="container">
        <h2>Ready to see it in action?</h2>
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
      .card {
        padding: var(--space-8);
      }
      .steps {
        margin: var(--space-6) 0 0;
        padding-left: var(--space-5);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        color: var(--ink-secondary);
        line-height: 1.6;
      }
      .steps strong {
        color: var(--ink);
      }
      .milestone-section {
        background: var(--surface-200);
      }
      .milestone-track {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: var(--space-4);
        margin-top: var(--space-8);
      }
      .milestone-step {
        background: var(--surface-100);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: var(--space-4);
      }
      .milestone-step p {
        margin-top: var(--space-3);
        color: var(--ink-secondary);
        font-size: var(--text-label-size);
        line-height: 1.5;
      }
      .milestone-branches {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        margin-top: var(--space-6);
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
      .verify-grid {
        margin-top: var(--space-8);
      }
      .verify-card p:last-child {
        color: var(--ink-secondary);
        font-size: var(--text-label-size);
        line-height: 1.5;
        margin-top: var(--space-2);
      }
      .verify-card h4 {
        margin: var(--space-1) 0;
      }
      .grid-5 {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: var(--space-4);
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
      @media (max-width: 900px) {
        .grid-2,
        .milestone-track,
        .grid-5 {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 560px) {
        .grid-2,
        .milestone-track,
        .grid-5 {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HowItWorksComponent {}
