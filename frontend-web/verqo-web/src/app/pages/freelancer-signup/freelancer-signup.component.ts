import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, RegisterFreelancerResponse } from '../../core/services/api.service';
import { aadhaarValidator } from '../../core/validators/aadhaar.validator';
import { panValidator } from '../../core/validators/pan.validator';

@Component({
  selector: 'app-freelancer-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="container form-page">
      @if (!result()) {
        <p class="badge badge-freelancer">For freelancers</p>
        <h1>Join as a freelancer</h1>
        <p class="subhead">
          Free to join — a fixed 5% fee only when you're paid. We validate your PAN and Aadhaar
          automatically, and check your EPF account status if you give us your UAN.
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
            Full name
            <input type="text" formControlName="displayName" />
          </label>

          <label>
            Primary role
            <input type="text" formControlName="primaryRole" placeholder="e.g. Backend Engineer" />
          </label>

          <label>
            PAN number
            <input type="text" formControlName="panNumber" placeholder="AAAAA9999A" maxlength="10" style="text-transform: uppercase" />
          </label>
          @if (panControl.touched && panControl.invalid) {
            <p class="field-error">{{ panControl.errors?.['required'] ? 'PAN is required.' : panControl.errors?.['panFormat'] }}</p>
          } @else if (panControl.touched && panControl.valid && panControl.value) {
            <p class="field-ok">Format looks valid — verified automatically on submit.</p>
          }

          <label>
            Aadhaar number
            <input type="text" formControlName="aadhaarNumber" placeholder="12 digits" maxlength="14" />
          </label>
          @if (aadhaarControl.touched && aadhaarControl.invalid) {
            <p class="field-error">
              {{
                aadhaarControl.errors?.['required']
                  ? 'Aadhaar is required.'
                  : (aadhaarControl.errors?.['aadhaarFormat'] ?? aadhaarControl.errors?.['aadhaarChecksum'])
              }}
            </p>
          } @else if (aadhaarControl.touched && aadhaarControl.valid && aadhaarControl.value) {
            <p class="field-ok">Checksum valid — verified automatically on submit. Only the last 4 digits are ever stored.</p>
          }

          <label>
            EPF UAN <span class="optional">(optional — enables the active-account check)</span>
            <input type="text" formControlName="epfUan" placeholder="12 digits" maxlength="12" />
          </label>

          @if (errorMessage()) {
            <p class="field-error">{{ errorMessage() }}</p>
          }

          <button type="submit" class="btn btn-accent" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Verifying…' : 'Create freelancer account' }}
          </button>
        </form>
      } @else {
        <h1>You're in</h1>
        <p class="subhead">Here's where your verification stands right now:</p>
        <ul class="status-list">
          <li>
            <span>PAN</span>
            <span class="status-pill" [class]="pillClass(result()!.profile.panStatus)">{{ statusLabel(result()!.profile.panStatus) }}</span>
          </li>
          <li>
            <span>Aadhaar</span>
            <span class="status-pill" [class]="pillClass(result()!.profile.aadhaarStatus)">{{ statusLabel(result()!.profile.aadhaarStatus) }}</span>
          </li>
          <li>
            <span>EPF active status</span>
            <span class="status-pill" [class]="pillClass(result()!.profile.epfStatus)">{{ statusLabel(result()!.profile.epfStatus) }}</span>
          </li>
        </ul>
        @if (!result()!.profile.isFullyVerified) {
          <p class="field-error">
            Some checks still need review — this is expected for the EPF check today (EPFO has no
            public API; a Verqo team member confirms it manually). We'll email you once everything clears.
          </p>
        }
      }
    </section>
  `,
  styles: [
    `
      .form-page {
        max-width: 560px;
        padding: var(--space-16) var(--space-6);
      }
      .subhead {
        color: var(--ink-secondary);
        line-height: 1.6;
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
    `,
  ],
})
export class FreelancerSignupComponent {
  private readonly fb = new FormBuilder();

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    displayName: ['', Validators.required],
    primaryRole: ['', Validators.required],
    panNumber: ['', [Validators.required, panValidator()]],
    aadhaarNumber: ['', [Validators.required, aadhaarValidator()]],
    epfUan: [''],
  });

  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  result = signal<RegisterFreelancerResponse | null>(null);

  get panControl() {
    return this.form.controls.panNumber;
  }

  get aadhaarControl() {
    return this.form.controls.aadhaarNumber;
  }

  /** Verification status pill styling — accent for verified/eligible states,
   * warning while pending or under manual review, danger if ineligible. */
  pillClass(status: string): string {
    switch (status) {
      case 'Eligible':
        return 'status-pill--verified';
      case 'Ineligible':
        return 'status-pill--failed';
      case 'NeedsReview':
        return 'status-pill--review';
      default:
        return 'status-pill--pending';
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'Eligible':
        return 'Verified';
      case 'Ineligible':
        return 'Not verified';
      case 'NeedsReview':
        return 'In review';
      default:
        return 'Pending';
    }
  }

  constructor(private readonly api: ApiService) {}

  submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    this.api
      .registerFreelancer({
        email: value.email,
        password: value.password,
        displayName: value.displayName,
        primaryRole: value.primaryRole,
        panNumber: value.panNumber,
        aadhaarNumber: value.aadhaarNumber,
        epfUan: value.epfUan || undefined,
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
              : 'Something went wrong verifying your details — please check them and try again.',
          );
        },
      });
  }
}
