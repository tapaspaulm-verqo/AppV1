import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

/**
 * Generic placeholder for every page in the Upwork-style sitemap that Verqo
 * doesn't yet have real content or a backing API for (dashboards, messaging,
 * help center, legal text, etc). Driven entirely by route `data` so adding a
 * new placeholder page is a one-line route, not a new component.
 *
 * Deliberately given a distinct muted background (surface-200, not the page
 * default surface-100) and a warning-colored "To be updated" pill, so it
 * reads as unmistakably unfinished rather than a quiet dead end.
 */
@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="coming-soon">
      <div class="container">
        <div class="card">
          <span class="status-pill status-pill--pending">To be updated</span>
          <h1>{{ title }}</h1>
          <p class="blurb">{{ blurb }}</p>
          @if (note) {
            <p class="note">{{ note }}</p>
          }
          <div class="actions">
            <a routerLink="/" class="btn btn-secondary">Back to home</a>
            @if (cta) {
              <a [routerLink]="cta.link" class="btn btn-primary">{{ cta.label }}</a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .coming-soon {
        background: var(--surface-200);
        min-height: 60vh;
        display: flex;
        align-items: center;
        padding: var(--space-16) 0;
      }
      .card {
        background: var(--surface-100);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: var(--space-10);
        max-width: 560px;
      }
      h1 {
        margin-top: var(--space-4);
      }
      .blurb {
        color: var(--ink-secondary);
        line-height: 1.6;
      }
      .note {
        color: var(--silver);
        font-size: var(--text-label-size);
        margin-top: var(--space-4);
      }
      .actions {
        display: flex;
        gap: var(--space-4);
        margin-top: var(--space-8);
        flex-wrap: wrap;
      }
      .actions a {
        text-decoration: none;
      }
    `,
  ],
})
export class ComingSoonComponent {
  title: string;
  blurb: string;
  note?: string;
  cta?: { label: string; link: string };

  constructor(route: ActivatedRoute) {
    const data = route.snapshot.data as {
      title?: string;
      blurb?: string;
      note?: string;
      cta?: { label: string; link: string };
    };
    this.title = data.title ?? 'This page is being built';
    this.blurb =
      data.blurb ??
      "We haven't published this part of Verqo yet — check back soon.";
    this.note = data.note;
    this.cta = data.cta;
  }
}
