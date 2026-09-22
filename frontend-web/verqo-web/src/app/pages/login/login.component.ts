import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="container form-page">
      <h1>Log in</h1>
      <p class="subhead">Freelancer or Client — one login for both, taken straight to your dashboard.</p>

      <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
        <label>
          Email
          <input type="email" formControlName="email" autocomplete="email" />
        </label>

        <label>
          Password
          <input type="password" formControlName="password" autocomplete="current-password" />
        </label>

        @if (errorMessage()) {
          <p class="field-error">{{ errorMessage() }}</p>
        }

        <button type="submit" class="btn btn-primary" [disabled]="form.invalid || submitting()">
          {{ submitting() ? 'Logging in…' : 'Log in' }}
        </button>

        <div class="demo-buttons">
          <span class="demo-title">Quick demo accounts:</span>
          <div class="demo-actions">
            <button type="button" class="btn btn-secondary demo-btn" (click)="loginAs('freelancer@verqo.com', 'password123')">
              Demo Freelancer
            </button>
            <button type="button" class="btn btn-secondary demo-btn" (click)="loginAs('client@verqo.com', 'password123')">
              Demo Client
            </button>
          </div>
        </div>
      </form>

      <p class="signup-hint">
        New here?
        <a routerLink="/signup/freelancer">Join as a freelancer</a>
        or
        <a routerLink="/signup/client">hire talent</a>.
      </p>
    </section>
  `,
  styles: [
    `
      .form-page {
        padding: var(--space-16) var(--space-6);
        max-width: 440px;
      }
      .subhead {
        color: var(--ink-secondary);
        margin-top: var(--space-2);
      }
      .login-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        margin-top: var(--space-8);
      }
      label {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        font-weight: 600;
        font-size: var(--text-label-size);
        color: var(--ink);
      }
      button {
        margin-top: var(--space-2);
      }
      .demo-buttons {
        margin-top: var(--space-4);
        padding-top: var(--space-4);
        border-top: 1px dashed var(--border-subtle);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .demo-title {
        font-size: 13px;
        color: var(--ink-secondary);
      }
      .demo-actions {
        display: flex;
        gap: var(--space-2);
      }
      .demo-btn {
        flex: 1;
        font-size: 13px;
        padding: var(--space-2) var(--space-3);
      }
      .signup-hint {
        margin-top: var(--space-8);
        color: var(--ink-secondary);
        font-size: var(--text-body-size);
      }
      .signup-hint a {
        color: var(--ink);
        font-weight: 600;
      }
      .field-error {
        color: var(--color-error);
        font-size: var(--text-label-size);
        margin: 0;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();
    this.api.login({ email: email!, password: password! }).subscribe({
      next: (response) => {
        this.auth.setSession(response.token, response.expiresAt, response.user);
        this.submitting.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Invalid email or password.');
      },
    });
  }

  loginAs(email: string, pass: string): void {
    this.form.setValue({ email, password: pass });
    this.submit();
  }
}
