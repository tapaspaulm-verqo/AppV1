import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, FreelancerDashboard, RecommendedJob } from '../../core/services/api.service';
import { formatDate, formatMinor, milestoneStateLabel, milestoneStatePillClass } from '../../core/utils/money';

@Component({
  selector: 'app-freelancer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container dashboard-page">
      @if (data(); as d) {
        <div class="dash-header">
          <div>
            <p class="badge badge-freelancer">Freelancer dashboard</p>
            <h1>Welcome back, {{ d.profile.displayName }}</h1>
            <p class="subhead">{{ d.profile.primaryRole }} · {{ d.profile.experienceLevel }}</p>
          </div>
          <span class="status-pill" [class]="d.profile.isFullyVerified ? 'status-pill--verified' : 'status-pill--pending'">
            {{ d.profile.isFullyVerified ? 'Verified' : 'Verification pending' }}
          </span>
        </div>

        <div class="stat-row">
          <div class="card stat-card card-accent-freelancer">
            <span class="stat-label">Active contracts</span>
            <span class="stat-value text-data">{{ d.summary.activeContracts }}</span>
          </div>
          <div class="card stat-card card-accent-freelancer">
            <span class="stat-label">Total earned</span>
            <span class="stat-value text-data">{{ money(d.summary.totalEarnedMinor) }}</span>
          </div>
          <div class="card stat-card card-accent-freelancer">
            <span class="stat-label">Pending in escrow</span>
            <span class="stat-value text-data">{{ money(d.summary.pendingInEscrowMinor) }}</span>
          </div>
          <div class="card stat-card card-accent-freelancer">
            <span class="stat-label">Open proposals</span>
            <span class="stat-value text-data">{{ d.summary.openProposalsCount }}</span>
          </div>
        </div>

        <div class="dash-columns">
          <div class="dash-main">
            <h2>Your contracts</h2>
            @if (d.contracts.length === 0) {
              <p class="empty">No contracts yet — apply to an open job to get started.</p>
            }
            @for (contract of d.contracts; track contract.id) {
              <article class="card contract-card card-accent-freelancer">
                <div class="contract-head">
                  <div>
                    <h3>{{ contract.jobTitle ?? contract.scopeSummary }}</h3>
                    <p class="text-secondary">{{ contract.counterpartyName }}</p>
                  </div>
                  <span class="badge">{{ contract.status }}</span>
                </div>

                @for (milestone of contract.milestones; track milestone.id) {
                  <div class="milestone-row">
                    <div class="milestone-info">
                      <span class="milestone-title">{{ milestone.title }}</span>
                      <span class="text-data milestone-amount">{{ money(milestone.contractValueMinor) }}</span>
                    </div>
                    <span class="status-pill" [class]="pillClass(milestone.state)">{{ stateLabel(milestone.state) }}</span>
                    @if (milestone.state === 'Funded') {
                      <button class="btn btn-accent btn-sm" (click)="start(milestone.id)" [disabled]="acting() === milestone.id">
                        {{ acting() === milestone.id ? 'Starting…' : 'Start work' }}
                      </button>
                    } @else if (milestone.state === 'InProgress') {
                      <button class="btn btn-accent btn-sm" (click)="submitWork(milestone.id)" [disabled]="acting() === milestone.id">
                        {{ acting() === milestone.id ? 'Submitting…' : 'Submit for review' }}
                      </button>
                    } @else if (milestone.state === 'Submitted' && milestone.reviewDeadlineAt) {
                      <span class="text-secondary deadline-note">Client review by {{ date(milestone.reviewDeadlineAt) }}</span>
                    }
                  </div>
                }
              </article>
            }
          </div>

          <aside class="dash-side">
            <div class="card tax-card">
              <h3>Earnings & taxes</h3>
              <dl class="tax-list">
                <dt>FY-to-date earned</dt>
                <dd class="text-data">{{ money(d.taxSummary.fyToDateEarnedMinor) }}</dd>
                <dt>Estimated TDS (Sec. 194-O)</dt>
                <dd class="text-data">{{ money(d.taxSummary.estimatedTdsMinor) }}</dd>
                <dt>GST collected on file</dt>
                <dd class="text-data">{{ money(d.taxSummary.totalGstCollectedMinor) }}</dd>
              </dl>
              <p class="tax-note">{{ d.taxSummary.note }}</p>
            </div>

            <div class="card jobs-card">
              <h3>New project search</h3>
              @if (d.recommendedJobs.length === 0) {
                <p class="empty">No open jobs matching your role right now.</p>
              }
              @for (job of d.recommendedJobs; track job.id) {
                <div class="rec-job">
                  <a [routerLink]="['/jobs', job.id]" class="rec-job-title">{{ job.title }}</a>
                  <p class="text-secondary">{{ job.clientName }} · {{ job.roleCategory }}</p>

                  @if (applyingTo() === job.id) {
                    <div class="apply-form">
                      <textarea
                        placeholder="Why you're a good fit…"
                        [value]="coverNote()"
                        (input)="coverNote.set($any($event.target).value)"
                        rows="2"
                      ></textarea>
                      <input
                        type="number"
                        placeholder="Proposed rate (₹)"
                        [value]="proposedRate()"
                        (input)="proposedRate.set($any($event.target).value)"
                      />
                      <div class="apply-actions">
                        <button class="btn btn-accent btn-sm" (click)="apply(job)" [disabled]="applySubmitting()">
                          {{ applySubmitting() ? 'Applying…' : 'Send proposal' }}
                        </button>
                        <button class="btn btn-secondary btn-sm" (click)="applyingTo.set(null)">Cancel</button>
                      </div>
                      @if (applyMessage(); as msg) {
                        <p class="field-ok">{{ msg }}</p>
                      }
                    </div>
                  } @else {
                    <button class="btn btn-secondary btn-sm" (click)="applyingTo.set(job.id)">Apply</button>
                  }
                </div>
              }
            </div>
          </aside>
        </div>
      } @else if (loading()) {
        <p class="loading">Loading your dashboard…</p>
      } @else if (loadError()) {
        <p class="field-error">Couldn't load your dashboard right now. Try refreshing.</p>
      }
    </section>
  `,
  styles: [
    `
      .dashboard-page {
        padding: var(--space-12) var(--space-6) var(--space-16);
        max-width: 1080px;
      }
      .loading,
      .empty {
        color: var(--ink-secondary);
        margin-top: var(--space-6);
      }
      .dash-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--space-4);
        flex-wrap: wrap;
      }
      .subhead {
        color: var(--ink-secondary);
        margin-top: var(--space-1);
      }
      .stat-row {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: var(--space-4);
        margin-top: var(--space-8);
      }
      .stat-card {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .stat-label {
        font-size: var(--text-label-size);
        color: var(--ink-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .stat-value {
        font-size: 24px;
      }
      .dash-columns {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--space-8);
        margin-top: var(--space-10);
        align-items: start;
      }
      .dash-main h2 {
        margin-bottom: var(--space-4);
      }
      .contract-card {
        margin-bottom: var(--space-4);
      }
      .contract-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--space-4);
        margin-bottom: var(--space-4);
      }
      .contract-head h3 {
        margin-bottom: var(--space-1);
      }
      .milestone-row {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3) 0;
        border-top: 1px solid var(--border-subtle);
        flex-wrap: wrap;
      }
      .milestone-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 160px;
      }
      .milestone-title {
        font-weight: 600;
      }
      .btn-sm {
        padding: var(--space-2) var(--space-3);
        font-size: var(--text-label-size);
      }
      .deadline-note {
        font-size: var(--text-label-size);
      }
      .dash-side {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
      }
      .tax-list {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--space-1) var(--space-3);
        margin: var(--space-4) 0;
      }
      .tax-list dt {
        color: var(--ink-secondary);
        font-size: var(--text-label-size);
      }
      .tax-list dd {
        margin: 0;
        text-align: right;
      }
      .tax-note {
        font-size: var(--text-label-size);
        color: var(--ink-secondary);
      }
      .rec-job {
        padding: var(--space-3) 0;
        border-top: 1px solid var(--border-subtle);
      }
      .rec-job:first-of-type {
        border-top: none;
      }
      .rec-job-title {
        font-weight: 600;
        text-decoration: none;
        color: var(--ink);
      }
      .apply-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        margin-top: var(--space-2);
      }
      .apply-actions {
        display: flex;
        gap: var(--space-2);
      }
      @media (max-width: 900px) {
        .stat-row {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .dash-columns {
          grid-template-columns: 1fr;
        }
      }
      /* Below ~400px even a 2-column stat grid leaves each card too
         narrow for a rupee amount to fit on one line — money values
         can't wrap (no break points in "₹4,85,000") or shrink, so a
         2-up layout here pushes a few px past the viewport edge into
         horizontal scroll. Stack to one column instead. */
      @media (max-width: 400px) {
        .stat-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class FreelancerDashboardComponent implements OnInit {
  loading = signal(true);
  loadError = signal(false);
  data = signal<FreelancerDashboard | null>(null);
  acting = signal<string | null>(null);

  applyingTo = signal<string | null>(null);
  coverNote = signal('');
  proposedRate = signal('');
  applySubmitting = signal(false);
  applyMessage = signal<string | null>(null);

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getFreelancerDashboard().subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  money(minor: number): string {
    return formatMinor(minor);
  }

  date(value: string | null | undefined): string {
    return formatDate(value);
  }

  pillClass(state: string): string {
    return milestoneStatePillClass(state);
  }

  stateLabel(state: string): string {
    return milestoneStateLabel(state);
  }

  start(milestoneId: string): void {
    this.acting.set(milestoneId);
    this.api.startMilestone(milestoneId).subscribe({
      next: () => {
        this.acting.set(null);
        this.load();
      },
      error: () => this.acting.set(null),
    });
  }

  submitWork(milestoneId: string): void {
    this.acting.set(milestoneId);
    this.api.submitMilestone(milestoneId).subscribe({
      next: () => {
        this.acting.set(null);
        this.load();
      },
      error: () => this.acting.set(null),
    });
  }

  apply(job: RecommendedJob): void {
    const rate = Number(this.proposedRate());
    if (!this.coverNote().trim() || !rate || rate <= 0) {
      this.applyMessage.set('Add a cover note and a proposed rate first.');
      return;
    }

    this.applySubmitting.set(true);
    this.api.submitProposal(job.id, this.coverNote().trim(), Math.round(rate * 100)).subscribe({
      next: () => {
        this.applySubmitting.set(false);
        this.applyMessage.set('Proposal sent.');
        this.applyingTo.set(null);
        this.coverNote.set('');
        this.proposedRate.set('');
      },
      error: () => {
        this.applySubmitting.set(false);
        this.applyMessage.set("Couldn't send that proposal — you may have already applied.");
      },
    });
  }
}
