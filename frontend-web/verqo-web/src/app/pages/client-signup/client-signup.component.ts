import { Component } from '@angular/core';

/**
 * Placeholder — full client signup (company profile, GSTIN, plan selection)
 * carries over from the original scaffold's scope. Not rebuilt in detail
 * here since this rebuild's brief specifically called out PAN/Aadhaar/EPF
 * on freelancer registration; wire this up the same way as
 * FreelancerSignupComponent (reactive form -> ApiService -> POST
 * /api/v1/clients/register) once that endpoint is added to Verqo.Api.
 */
@Component({
  selector: 'app-client-signup',
  standalone: true,
  template: `
    <section class="container placeholder-page">
      <h1>Hire verified tech talent</h1>
      <p class="subhead">
        Client signup carries over from the original scaffold's scope (company profile, GSTIN,
        Standard/Business Plus plan) — not the focus of this rebuild, which is the .NET/Angular/
        mobile stack and the new PAN/Aadhaar/EPF freelancer verification. See
        FreelancerSignupComponent for the pattern to extend this page with.
      </p>
    </section>
  `,
  styles: [
    `
      .placeholder-page {
        padding: var(--space-16) var(--space-6);
        max-width: 640px;
      }
      .subhead {
        color: var(--ink-secondary);
        line-height: 1.6;
      }
    `,
  ],
})
export class ClientSignupComponent {}
