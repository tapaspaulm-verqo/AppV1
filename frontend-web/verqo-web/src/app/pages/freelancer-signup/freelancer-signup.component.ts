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

          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || submitting()">
            {{ submitting() ? 'Verifying…' : 'Create freelancer account' }}
          </button>
        </form>
      } @else {
        <h1>You're in</h1>
        <p class="subhead">Here's where your verification stands right now:</p>
        <ul class="status-list">
          <li>PAN: <strong>{{ result()!.profile.panStatus }}</strong></li>
          <li>Aadhaar: <strong>{{ result()!.profile.aadhaarStatus }}</strong></li>
          <li>EPF active status: <strong>{{ result()!.profile.epfStatus }}</strong></li>
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
        padding: 64px 24px;
      }
      .subhead {
        color: #444;
        line-height: 1.6;
      }
      .signup-form {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 32px;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-weight: 600;
        font-size: 14px;
        margin-top: 16px;
      }
      .optional {
        font-weight: 400;
        color: var(--verqo-silver);
      }
      button {
        margin-top: 28px;
      }
      .status-list {
        margin-top: 24px;
        line-height: 2;
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
