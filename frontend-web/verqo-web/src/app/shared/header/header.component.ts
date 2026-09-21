import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <div class="container header-row">
        <a routerLink="/" class="wordmark">VERQO<span>.</span></a>
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
        border-bottom: 1px solid var(--verqo-silver-light);
      }
      .header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
      }
      .wordmark {
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 20px;
        text-decoration: none;
        color: var(--verqo-black);
      }
      .wordmark span {
        color: var(--verqo-success);
      }
      .nav-links {
        display: flex;
        align-items: center;
        gap: 24px;
      }
      .nav-links a:not(.btn) {
        text-decoration: none;
        font-weight: 500;
        color: var(--verqo-black);
      }
      .nav-links .btn {
        text-decoration: none;
        display: inline-block;
      }
    `,
  ],
})
export class HeaderComponent {}
