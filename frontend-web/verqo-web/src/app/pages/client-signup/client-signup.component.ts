import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, RegisterClientResponse } from '../../core/services/api.service';
import { gstinValidator } from '../../core/validators/gstin.validator';

/**
 * Client registration, wired to POST /api/v1/clients/register (see
 * Verqo.Application.Clients.RegisterClientService and ClientsController).
 * Deliberately lighter than freelancer signup: a Client only needs a
 * company name and an optional GSTIN to register. Full business
 * verification (incorporation, GST, authorised signatory, bank account —
 * draft Client Agreement Annex D) happens later, before a Client can fund
 * a Milestone, not as a registration gate — so this form doesn't ask for
 * it. Every self-serve signup starts on the Standard plan; Business Plus
 * is volume-negotiated (draft Client Agreement Clause 4.3), so that's
 * routed to Contact/Enterprise rather than offered as a form field here.
 */
@Component({
  selector: 'app-client-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="container form-page">
      @if (!result()) {
        <p class="badge badge-client">For businesses</p>
        <h1>Hire verified tech talent</h1>
        <p class="subhead">
          Free to register — a 10% Client Fee on the Standard plan, added to what you fund, with no
          registration or subscription fee. Need Business Plus (volume pricing down to 5%,
          dedicated support)?
          <a routerLink="/enterprise">Talk to us about Enterprise</a>.
        </p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="signup-form">
          <label>
            Email
            <input type="email" formControlName="email" />
          </label>

          <label>
            Password
            <input type="password" formControlName="password" />
          </label>

          <label>
            Company name
            <input type="text" formControlName="companyName" placeholder="e.g. Example Technologies Pvt Ltd" />
          </label>

          <label>
            GSTIN <span class="optional">(optional — you can add this later, before funding a milestone)</span>
            <input type="text" formControlName="gstin" placeholder="22AAAAA0000A1Z5" maxlength="17" style="text-transform: uppercase" />
          </label>
          @if (gstinControl.touched && gstinControl.invalid) {
            <p class="field-error">{{ gstinControl.errors?.['gstinFormat'] }}</p>
          } @else if (gstinControl.touched && gstinControl.valid && gstinControl.value) {
            <p class="field-ok">Format looks valid.</p>
          }

          @if (errorMessage()) {
            <p class="field-error">{{ errorMessage() }}</p>
          }

          <button type="submit" class="btn btn-client" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Creating account…' : 'Create client account' }}
          </button>

          <p class="legal-note">
            By creating an account, you agree to Verqo's
            <a routerLink="/legal/terms">Terms of Use</a>,
            <a routerLink="/legal/privacy">Privacy Policy</a> and
            <a routerLink="/legal/client-agreement">Client Agreement</a>.
          </p>
        </form>
      } @else {
        <h1>You're in</h1>
        <p class="subhead">{{ result()!.profile.companyName }} is registered on the Standard plan.</p>
        <ul class="status-list">
          <li>
            <span>Plan</span>
            <span class="status-pill status-pill--verified">{{ result()!.profile.plan }}</span>
          </li>
          <li>
            <span>GSTIN</span>
            <span class="status-pill" [class]="result()!.profile.gstin ? 'status-pill--verified' : 'status-pill--pending'">
              {{ result()!.profile.gstin || 'Not provided yet' }}
            </span>
          </li>
        </ul>
        <p class="field-ok">
          Next: post a role, or read <a routerLink="/how-it-works">how escrow and Milestones work</a> before
          you do.
        </p>
        <div class="actions">
          <a routerLink="/business" class="btn btn-client">See what Verqo offers businesses</a>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .form-page {
        max-width: 560px;
        padding: var(--space-16) var(--space-6);
      }
      h1 {
        margin-top: var(--space-2);
      }
      .subhead {
        color: var(--ink-secondary);
        line-height: 1.6;
      }
      .subhead a {
        color: var(--client);
        font-weight: 600;
      }
      .signup-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        margin-top: var(--space-8);
      }
      label {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        font-weight: 600;
        font-size: 14px;
        margin-top: var(--space-4);
      }
      .optional {
        font-weight: 400;
        color: var(--silver);
      }
      button {
        margin-top: var(--space-7, 28px);
      }
      .legal-note {
        color: var(--silver);
        font-size: var(--text-label-size);
        font-weight: 400;
        line-height: 1.6;
        margin-top: var(--space-4);
      }
      .legal-note a {
        color: var(--ink-secondary);
        font-weight: 600;
        text-decoration: underline;
      }
      .status-list {
        list-style: none;
        padding: 0;
        margin-top: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .status-list li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        padding: var(--space-3) 0;
        border-bottom: 1px solid var(--border-subtle);
        font-weight: 600;
        font-size: var(--text-body-size);
      }
      .field-ok {
        color: var(--ink-secondary);
        margin-top: var(--space-4);
      }
      .field-ok a {
        color: var(--client);
        font-weight: 600;
      }
      .actions {
        display: flex;
        gap: var(--space-4);
        margin-top: var(--space-6);
        flex-wrap: wrap;
      }
      .actions a {
        text-decoration: none;
      }
    `,
  ],
})
export class ClientSignupComponent {
  private readonly fb = new FormBuilder();

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    companyName: ['', Validators.required],
    gstin: ['', [gstinValidator()]],
  });

  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  result = signal<RegisterClientResponse | null>(null);

  get gstinControl() {
    return this.form.controls.gstin;
  }

  constructor(private readonly api: ApiService) {}

  submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    this.api
      .registerClient({
        email: value.email,
        password: value.password,
        companyName: value.companyName,
        gstin: value.gstin || undefined,
      })
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          this.result.set(res);
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(
            err?.error?.errors
              ? Object.values(err.error.errors).flat().join(' ')
              : 'Something went wrong creating your account — please check your details and try again.',
          );
        },
      });
  }
}
