import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="container header-row">
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
        <nav class="primary-nav">
          <a routerLink="/talent" routerLinkActive="active">Find talent</a>
          <a routerLink="/jobs" routerLinkActive="active">Find work</a>
          <a routerLink="/how-it-works" routerLinkActive="active">How it works</a>
          <a routerLink="/pricing" routerLinkActive="active">Pricing</a>
        </nav>
        <div class="actions">
          <a routerLink="/login" class="login-link">Log in</a>
          <a routerLink="/business" class="btn btn-client-outline">Hire talent</a>
          <a routerLink="/signup/freelancer" class="btn btn-accent">Join as a freelancer</a>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .site-header {
        border-bottom: 1px solid var(--border-subtle);
        background: var(--surface-100);
      }
      .header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-6);
        padding: var(--space-4) var(--space-6);
      }
      .wordmark {
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
        font-size: 20px;
        letter-spacing: 0.01em;
        color: var(--ink);
      }
      .primary-nav {
        display: flex;
        align-items: center;
        gap: var(--space-6);
        flex: 1;
      }
      .primary-nav a {
        text-decoration: none;
        font-weight: 500;
        font-size: 14px;
        color: var(--ink-secondary);
      }
      .primary-nav a:hover,
      .primary-nav a.active {
        color: var(--ink);
      }
      .actions {
        display: flex;
        align-items: center;
        gap: var(--space-4);
      }
      .login-link {
        text-decoration: none;
        font-weight: 500;
        font-size: 14px;
        color: var(--ink);
        white-space: nowrap;
      }
      .actions .btn {
        text-decoration: none;
        display: inline-block;
        white-space: nowrap;
      }
      @media (max-width: 900px) {
        .primary-nav {
          display: none;
        }
      }
      @media (max-width: 560px) {
        /* Specificity note: plain .login-link/.btn-client-outline selectors
           here used to lose the cascade to the unconditional, higher-
           specificity ".actions .btn { display: inline-block; }" rule
           above, so the outline button never actually hid — it silently
           pushed the header (and the whole page) into horizontal overflow
           on every phone-width screen. Scoping to .site-header raises
           specificity above ".actions .btn" so this actually wins. */
        .site-header .login-link,
        .site-header .btn-client-outline {
          display: none;
        }
      }
      /* At the narrowest common phone width (~320px, e.g. iPhone SE), even
         the wordmark + single remaining CTA don't both fit on one line —
         wrap rather than let the header force horizontal scroll on the
         whole page. */
      @media (max-width: 340px) {
        .header-row {
          flex-wrap: wrap;
          row-gap: var(--space-2);
        }
        .site-header .actions {
          width: 100%;
          justify-content: flex-end;
        }
      }
    `,
  ],
})
export class HeaderComponent {}
