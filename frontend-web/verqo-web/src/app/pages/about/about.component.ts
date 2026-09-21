import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Content here is the documented positioning (three pillars) and values
 * table from the brand doc, written as prose. Deliberately does not
 * invent a founding story, team bios, office location or funding history —
 * none of that is documented, so none of it appears here.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero container">
      <p class="badge">About Verqo</p>
      <h1>Built in India, for Indian tech talent</h1>
      <p class="subhead">
        Verqo exists because IT services firms keep an estimated 50–80% of a resource's cost,
        leaving the professional doing the work with 20–40%. We built a direct path between
        verified tech freelancers and the businesses that need them.
      </p>
    </section>

    <section class="section">
      <div class="container grid-3">
        <div class="card">
          <h3>Built in India, for Indian tech talent</h3>
          <p>Priced in rupees, paid out by UPI, IMPS or NEFT, and designed around how Indian freelancers and businesses actually work.</p>
        </div>
        <div class="card">
          <h3>Money is sacred</h3>
          <p>Fee and escrow math stays legible — you can always see exactly what you're paying, what you're keeping, and where a rupee currently sits.</p>
        </div>
        <div class="card">
          <h3>Verified, not hyped</h3>
          <p>Every freelancer clears identity verification before their profile goes live. Trust is earned through checks, not marketing copy.</p>
        </div>
      </div>
    </section>

    <section class="section values-section">
      <div class="container">
        <h2>What we hold ourselves to</h2>
        <div class="grid-5">
          <div class="value"><h4>Integrity</h4><p>Say the real number, every time.</p></div>
          <div class="value"><h4>Flexibility</h4><p>Hourly or project, B2B or B2C — work the way that fits.</p></div>
          <div class="value"><h4>Trust</h4><p>Earned through verification and escrow, not promises.</p></div>
          <div class="value"><h4>Upright</h4><p>Name the state, not the mechanism — no jargon between you and your money.</p></div>
          <div class="value"><h4>Professionalism</h4><p>Every freelancer is addressed — and treated — as one.</p></div>
        </div>
      </div>
    </section>

    <section class="section final-cta">
      <div class="container">
        <h2>See it for yourself</h2>
        <div class="cta-row">
          <a routerLink="/how-it-works" class="btn btn-primary">How it works</a>
          <a routerLink="/trust-safety" class="btn btn-secondary">Trust &amp; safety</a>
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
      .values-section {
        background: var(--surface-200);
      }
      .grid-5 {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: var(--space-4);
        margin-top: var(--space-8);
      }
      .value {
        background: var(--surface-100);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: var(--space-5);
      }
      .value h4 {
        margin: 0 0 var(--space-2);
      }
      .value p {
        color: var(--ink-secondary);
        font-size: var(--text-label-size);
        line-height: 1.5;
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
        .grid-3,
        .grid-5 {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 560px) {
        .grid-3,
        .grid-5 {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AboutComponent {}
