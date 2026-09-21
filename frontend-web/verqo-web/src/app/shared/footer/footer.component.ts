import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a routerLink="/" class="wordmark" aria-label="Verqo home">
            <svg class="wordmark-mark" viewBox="0 0 200 200" role="img" aria-hidden="true">
              <g fill="none" stroke="var(--ink)" stroke-width="10" stroke-linecap="round">
                <line x1="58" y1="52" x2="94" y2="168" />
                <line x1="94" y1="168" x2="170" y2="76" />
                <line x1="170" y1="76" x2="58" y2="52" />
              </g>
              <circle cx="58" cy="52" r="15" fill="var(--client)" />
              <circle cx="94" cy="168" r="17" fill="var(--accent)" />
              <circle cx="170" cy="76" r="10" fill="var(--verqo)" />
            </svg>
            <span class="wordmark-text">VERQO</span>
          </a>
          <p class="tagline">India's platform for tech freelancers.</p>
          <p class="tagline-sub">Verified talent · Escrow-protected payments · No subscriptions.</p>
        </div>

        <nav class="footer-col">
          <h4>For clients</h4>
          <a routerLink="/business">Hire talent</a>
          <a routerLink="/how-it-works">How it works</a>
          <a routerLink="/pricing">Pricing</a>
          <a routerLink="/enterprise">Enterprise</a>
        </nav>

        <nav class="footer-col">
          <h4>For freelancers</h4>
          <a routerLink="/jobs">Find work</a>
          <a routerLink="/freelancers">Why Verqo</a>
          <a routerLink="/trust-safety">Verification &amp; trust</a>
          <a routerLink="/pricing">Pricing</a>
        </nav>

        <nav class="footer-col">
          <h4>Company</h4>
          <a routerLink="/about">About</a>
          <a routerLink="/careers">Careers</a>
          <a routerLink="/contact">Contact</a>
          <a routerLink="/trust-safety">Trust &amp; safety</a>
        </nav>

        <nav class="footer-col">
          <h4>Resources</h4>
          <a routerLink="/help">Help center</a>
          <a routerLink="/resources">Blog</a>
          <a routerLink="/legal/terms">Terms of service</a>
          <a routerLink="/legal/privacy">Privacy policy</a>
        </nav>
      </div>

      <div class="container footer-bottom">
        <p>&copy; {{ year }} Verqo. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [
    `
      .site-footer {
        background: var(--surface-200);
        border-top: 1px solid var(--border-subtle);
        padding-top: var(--space-16);
      }
      .footer-grid {
        display: grid;
        grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr;
        gap: var(--space-8);
        padding-bottom: var(--space-12);
      }
      .footer-brand .wordmark {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        text-decoration: none;
      }
      .wordmark-mark {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
      }
      .wordmark-text {
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 18px;
        color: var(--ink);
      }
      .tagline {
        margin-top: var(--space-4);
        color: var(--ink);
        font-weight: 600;
      }
      .tagline-sub {
        color: var(--ink-secondary);
        font-size: var(--text-label-size);
      }
      .footer-col {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .footer-col h4 {
        font-family: var(--font-body);
        font-size: var(--text-label-size);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--silver);
        margin: 0 0 var(--space-1) 0;
      }
      .footer-col a {
        text-decoration: none;
        color: var(--ink-secondary);
        font-size: var(--text-body-size);
      }
      .footer-col a:hover {
        color: var(--ink);
      }
      .footer-bottom {
        border-top: 1px solid var(--border-subtle);
        padding: var(--space-6) 0;
      }
      .footer-bottom p {
        margin: 0;
        color: var(--silver);
        font-size: var(--text-label-size);
      }
      @media (max-width: 860px) {
        .footer-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .footer-brand {
          grid-column: 1 / -1;
        }
      }
    `,
  ],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
