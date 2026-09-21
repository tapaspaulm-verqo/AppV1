import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
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
        <nav class="nav-links">
          <a routerLink="/jobs">Find work</a>
          <a routerLink="/signup/client">Hire talent</a>
          <a routerLink="/signup/freelancer" class="btn btn-primary">Join as a freelancer</a>
        </nav>
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
        padding: var(--space-5) var(--space-6);
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
      .nav-links {
        display: flex;
        align-items: center;
        gap: var(--space-6);
      }
      .nav-links a:not(.btn) {
        text-decoration: none;
        font-weight: 500;
        color: var(--ink);
      }
      .nav-links .btn {
        text-decoration: none;
        display: inline-block;
      }
    `,
  ],
})
export class HeaderComponent {}
