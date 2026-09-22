import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, ClientDashboard, FreelancerListItem } from '../../core/services/api.service';
import { formatDate, formatMinor, milestoneStateLabel, milestoneStatePillClass } from '../../core/utils/money';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="container dashboard-page">
      @if (data(); as d) {
        <div class="dash-header">
          <div>
            <p class="badge badge-client">Client dashboard</p>
            <h1>{{ d.profile.companyName }}</h1>
            <p class="subhead">{{ d.profile.plan }} plan{{ d.profile.gstin ? ' · GSTIN on file' : '' }}</p>
          </div>
        </div>

        <div class="stat-row">
          <div class="card stat-card card-accent-client">
            <span class="stat-label">Active contracts</span>
            <span class="stat-value text-data">{{ d.summary.activeContracts }}</span>
          </div>
          <div class="card stat-card card-accent-client">
            <span class="stat-label">Escrow balance</span>
            <span class="stat-value text-data">{{ money(d.summary.escrowBalanceMinor) }}</span>
          </div>
          <div class="card stat-card card-accent-client">
            <span class="stat-label">Pending approvals</span>
            <span class="stat-value text-data">{{ d.summary.pendingApprovalsCount }}</span>
          </div>
          <div class="card stat-card card-accent-client">
            <span class="stat-label">Open job posts</span>
            <span class="stat-value text-data">{{ d.summary.openJobsCount }}</span>
          </div>
        </div>

        @if (d.pendingApprovals.length > 0) {
          <div class="card approvals-card card-accent-client">
            <h2>Pending approvals</h2>
            <p class="text-secondary">Work submitted and waiting for you to release payment.</p>
            @for (approval of d.pendingApprovals; track approval.id) {
              <div class="approval-row">
                <div class="milestone-info">
                  <span class="milestone-title">{{ approval.title }}</span>
                  <span class="text-secondary">{{ approval.freelancerName }}</span>
                </div>
                <span class="text-data">{{ money(approval.contractValueMinor) }}</span>
                @if (approval.reviewDeadlineAt) {
                  <span class="text-secondary deadline-note">Review by {{ date(approval.reviewDeadlineAt) }}</span>
                }
                <button class="btn btn-client btn-sm" (click)="approve(approval.id)" [disabled]="acting() === approval.id">
                  {{ acting() === approval.id ? 'Releasing…' : 'Approve & release' }}
                </button>
              </div>
            }
          </div>
        }

        <div class="dash-columns">
          <div class="dash-main">
            <h2>Your contractors</h2>
            @if (d.contracts.length === 0) {
              <p class="empty">No active contracts yet — find a contractor or post a project to get started.</p>
            }
            @for (contract of d.contracts; track contract.id) {
              <article class="card contract-card card-accent-client">
                <div class="contract-head">
                  <div>
                    <h3>{{ contract.jobTitle ?? contract.scopeSummary }}</h3>
                    <p class="text-secondary">{{ contract.freelancerName }} · {{ contract.freelancerRole }}</p>
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
                    @if (milestone.state === 'Unfunded') {
                      <button class="btn btn-client btn-sm" (click)="fund(milestone.id)" [disabled]="acting() === milestone.id">
                        {{ acting() === milestone.id ? 'Funding…' : 'Fund escrow' }}
                      </button>
                    }
                  </div>
                }
              </article>
            }

            <h2 class="section-gap">Your job posts</h2>
            @if (d.postedJobs.length === 0) {
              <p class="empty">Nothing posted yet.</p>
            }
            @for (job of d.postedJobs; track job.id) {
              <div class="posted-job-row">
                <span>{{ job.title }}</span>
                <span class="badge">{{ job.status }}</span>
                <span class="text-secondary">{{ job.proposalCount }} proposal{{ job.proposalCount === 1 ? '' : 's' }}</span>
              </div>
            }
          </div>

          <aside class="dash-side">
            <div class="card">
              <h3>Create new project</h3>
              <form [formGroup]="jobForm" (ngSubmit)="createJob()" class="job-form">
                <input type="text" formControlName="title" placeholder="Project title" />
                <textarea formControlName="description" placeholder="What needs doing" rows="3"></textarea>
                <input type="text" formControlName="roleCategory" placeholder="Role, e.g. Backend Engineer" />
                <div class="budget-row">
                  <input type="number" formControlName="budgetMinorMin" placeholder="Budget from (₹)" />
                  <input type="number" formControlName="budgetMinorMax" placeholder="Budget to (₹)" />
                </div>
                <button type="submit" class="btn btn-client btn-sm" [disabled]="jobForm.invalid || postingJob()">
                  {{ postingJob() ? 'Posting…' : 'Post project' }}
                </button>
                @if (jobMessage(); as msg) {
                  <p class="field-ok">{{ msg }}</p>
                }
              </form>
            </div>

            <div class="card">
              <h3>Find new contractors</h3>
              <div class="search-row">
                <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Search by role or name" />
                <button class="btn btn-secondary btn-sm" (click)="searchFreelancers()">Search</button>
              </div>
              @if (searching()) {
                <p class="loading">Searching…</p>
              }
              @for (freelancer of freelancers(); track freelancer.id) {
                <div class="freelancer-row">
                  <div>
                    <span class="freelancer-name">{{ freelancer.displayName }}</span>
                    @if (freelancer.isFullyVerified) {
                      <span class="status-pill status-pill--verified">Verified</span>
                    }
                    <p class="text-secondary">{{ freelancer.primaryRole }} · {{ freelancer.experienceLevel }}</p>
                  </div>
                  @if (freelancer.hourlyRateMinor) {
                    <span class="text-data">{{ money(freelancer.hourlyRateMinor) }}/hr</span>
                  }
                </div>
              }
              @if (searched() && freelancers().length === 0 && !searching()) {
                <p class="empty">No contractors match that search.</p>
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
      .approvals-card {
        margin-top: var(--space-6);
      }
      .approval-row {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3) 0;
        border-top: 1px solid var(--border-subtle);
        flex-wrap: wrap;
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
      .section-gap {
        margin-top: var(--space-10);
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
      .deadline-note {
        font-size: var(--text-label-size);
      }
      .btn-sm {
        padding: var(--space-2) var(--space-3);
        font-size: var(--text-label-size);
      }
      .posted-job-row {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-3) 0;
        border-top: 1px solid var(--border-subtle);
      }
      .posted-job-row:first-of-type {
        border-top: none;
      }
      .dash-side {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
      }
      .job-form,
      .search-row {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        margin-top: var(--space-4);
      }
      .search-row {
        flex-direction: row;
      }
      .budget-row {
        display: flex;
        gap: var(--space-3);
      }
      .freelancer-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--space-3);
        padding: var(--space-3) 0;
        border-top: 1px solid var(--border-subtle);
      }
      .freelancer-name {
        font-weight: 600;
        margin-right: var(--space-2);
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
         can't wrap (no break points in "₹21,00,000") or shrink, so a
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
export class ClientDashboardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  loading = signal(true);
  loadError = signal(false);
  data = signal<ClientDashboard | null>(null);
  acting = signal<string | null>(null);

  postingJob = signal(false);
  jobMessage = signal<string | null>(null);

  searchQuery = signal('');
  freelancers = signal<FreelancerListItem[]>([]);
  searching = signal(false);
  searched = signal(false);

  readonly jobForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    roleCategory: ['', [Validators.required]],
    budgetMinorMin: [null as number | null],
    budgetMinorMax: [null as number | null],
  });

  ngOnInit(): void {
    this.load();
    this.searchFreelancers();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getClientDashboard().subscribe({
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

  fund(milestoneId: string): void {
    this.acting.set(milestoneId);
    this.api.fundMilestone(milestoneId).subscribe({
      next: () => {
        this.acting.set(null);
        this.load();
      },
      error: () => this.acting.set(null),
    });
  }

  approve(milestoneId: string): void {
    this.acting.set(milestoneId);
    this.api.approveMilestone(milestoneId).subscribe({
      next: () => {
        this.acting.set(null);
        this.load();
      },
      error: () => this.acting.set(null),
    });
  }

  createJob(): void {
    if (this.jobForm.invalid) return;

    this.postingJob.set(true);
    this.jobMessage.set(null);

    const raw = this.jobForm.getRawValue();
    this.api
      .createJob({
        title: raw.title!,
        description: raw.description!,
        roleCategory: raw.roleCategory!,
        budgetMinorMin: raw.budgetMinorMin != null ? Math.round(raw.budgetMinorMin * 100) : undefined,
        budgetMinorMax: raw.budgetMinorMax != null ? Math.round(raw.budgetMinorMax * 100) : undefined,
      })
      .subscribe({
        next: () => {
          this.postingJob.set(false);
          this.jobMessage.set('Project posted — freelancers can now apply.');
          this.jobForm.reset();
          this.load();
        },
        error: () => {
          this.postingJob.set(false);
          this.jobMessage.set("Couldn't post that project — check the required fields.");
        },
      });
  }

  searchFreelancers(): void {
    this.searching.set(true);
    this.api.searchFreelancers({ q: this.searchQuery().trim() || undefined }).subscribe({
      next: (list) => {
        this.freelancers.set(list);
        this.searching.set(false);
        this.searched.set(true);
      },
      error: () => {
        this.searching.set(false);
        this.searched.set(true);
      },
    });
  }
}
