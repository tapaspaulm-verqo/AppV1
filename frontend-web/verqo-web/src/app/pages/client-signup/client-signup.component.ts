import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Placeholder — full client signup (company profile, GSTIN, plan selection)
 * carries over from the original scaffold's scope. Not rebuilt in detail
 * here since this rebuild's brief specifically called out PAN/Aadhaar/EPF
 * on freelancer registration; wire this up the same way as
 * FreelancerSignupComponent (reactive form -> ApiService -> POST
 * /api/v1/clients/register) once that endpoint is added to Verqo.Api.
 *
 * Given the muted "to be updated" treatment for the same reason as
 * ComingSoonComponent — there's no backing endpoint yet — but keeps its own
 * copy since there's real, specific context to share (what the form will
 * collect, and why it isn't live yet) rather than the generic blurb.
 */
@Component({
  selector: 'app-client-signup',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="placeholder-section">
      <div class="container">
        <div class="card">
          <span class="status-pill status-pill--pending">To be updated</span>
          <p class="badge badge-client">For businesses</p>
          <h1>Hire verified tech talent</h1>
          <p class="subhead">
            Client registration — company profile, GSTIN, and choosing between the Standard and
            Business Plus plans — isn't wired up to the API yet. Once it is, it'll follow the
            same verified-onboarding pattern as freelancer signup.
          </p>
          <div class="actions">
            <a routerLink="/business" class="btn btn-secondary">See what Verqo offers businesses</a>
            <a routerLink="/pricing" class="btn btn-client">View pricing</a>
          </div>
          <p class="legal-note">
            Registering as a Client will mean agreeing to Verqo's
            <a routerLink="/legal/terms">Terms of Use</a>,
            <a routerLink="/legal/privacy">Privacy Policy</a> and
            <a routerLink="/legal/client-agreement">Client Agreement</a>.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .placeholder-section {
        background: var(--surface-200);
        min-height: 60vh;
        display: flex;
        align-items: center;
        padding: var(--space-16) 0;
      }
      .card {
        background: var(--surface-100);
        border: 1px solid var(--border-subtle);
        border-left: 3px solid var(--client);
        border-radius: var(--radius-lg);
        padding: var(--space-10);
        max-width: 640px;
      }
      .badge {
        margin-top: var(--space-4);
      }
      h1 {
        margin-top: var(--space-2);
      }
      .subhead {
        color: var(--ink-secondary);
        line-height: 1.6;
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
      .legal-note {
        color: var(--silver);
        font-size: var(--text-label-size);
        line-height: 1.6;
        margin-top: var(--space-6);
      }
      .legal-note a {
        color: var(--ink-secondary);
        font-weight: 600;
        text-decoration: underline;
      }
    `,
  ],
})
export class ClientSignupComponent {}
