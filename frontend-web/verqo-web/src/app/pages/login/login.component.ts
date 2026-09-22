import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="container form-page">
      <h1>Log in</h1>
      <p class="subhead">Freelancer or Client — one login for both, taken straight to your dashboard.</p>

      <div class="oauth-section">
        <button type="button" class="btn btn-secondary google-btn" (click)="loginWithGoogle()" [disabled]="submitting()">
          <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <div class="divider">
        <span>or log in with email</span>
      </div>

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
      .oauth-section {
        margin-top: var(--space-6);
      }
      .google-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-3);
        font-weight: 500;
        background: #ffffff;
        border: 1px solid var(--border-subtle);
        color: var(--ink);
        padding: var(--space-3);
      }
      .google-btn:hover:not(:disabled) {
        background: #f8fafc;
      }
      .divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: var(--space-6) 0 var(--space-2);
        color: var(--ink-secondary);
        font-size: 13px;
      }
      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--border-subtle);
      }
      .divider span {
        padding: 0 var(--space-3);
      }
      .login-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        margin-top: var(--space-2);
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
  private readonly firebase = inject(FirebaseService);
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

  async loginWithGoogle(): Promise<void> {
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      const user = await this.firebase.loginWithGoogle();
      this.api.firebaseLogin({
        email: user.email || 'user@verqo.com',
        displayName: user.displayName || 'Verqo User',
        uid: user.uid,
      }).subscribe({
        next: (response) => {
          this.auth.setSession(response.token, response.expiresAt, response.user);
          this.submitting.set(false);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set('Google authentication failed. Please try again.');
        },
      });
    } catch (err: any) {
      this.submitting.set(false);
      if (err?.code !== 'auth/popup-closed-by-user') {
        this.errorMessage.set('Google sign-in was cancelled or encountered an error.');
      }
    }
  }

  loginAs(email: string, pass: string): void {
    this.form.setValue({ email, password: pass });
    this.submit();
  }
}
