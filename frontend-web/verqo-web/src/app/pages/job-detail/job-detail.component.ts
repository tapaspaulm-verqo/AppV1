import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, JobDetail } from '../../core/services/api.service';
import { channelLabel, formatBudgetRange, jobStatusLabel } from '../../core/utils/job-labels';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (job(); as j) {
      <section class="container job-detail">
        <a routerLink="/jobs" class="back-link">← All open jobs</a>
        <div class="layout">
          <div class="main">
            <p class="badge">{{ j.roleCategory }} · {{ channelLabel(j.channel) }}</p>
            <h1>{{ j.title }}</h1>
            <p class="meta">Posted {{ j.createdAt | date: 'mediumDate' }} · <span class="status-pill status-pill--pending">{{ statusLabel(j.status) }}</span></p>
            <div class="description">
              <h3>About this role</h3>
              <p>{{ j.description }}</p>
            </div>
          </div>
          <aside class="sidebar card">
            <h4>Job details</h4>
            <dl>
              <dt>Budget</dt>
              <dd class="text-data">{{ budget(j) ?? 'Not specified' }}</dd>
              <dt>Category</dt>
              <dd>{{ j.roleCategory }}</dd>
              <dt>Engagement</dt>
              <dd>{{ channelLabel(j.channel) }}</dd>
              <dt>Status</dt>
              <dd>{{ statusLabel(j.status) }}</dd>
            </dl>
            <a routerLink="/signup/freelancer" class="btn btn-primary apply-btn">Apply as a freelancer</a>
            <p class="apply-note">Applying requires a verified freelancer account.</p>
          </aside>
        </div>
      </section>
    } @else if (notFound()) {
      <section class="container job-detail">
        <p class="badge">Find work</p>
        <h1>We couldn't find that job</h1>
        <p class="subhead">It may have closed, or the link isn't right.</p>
        <a routerLink="/jobs" class="btn btn-secondary">Back to open jobs</a>
      </section>
    }
  `,
  styles: [
    `
      .job-detail {
        padding: var(--space-12) var(--space-6) var(--space-16);
      }
      .back-link {
        color: var(--ink-secondary);
        text-decoration: none;
        font-size: var(--text-label-size);
        font-weight: 600;
      }
      .layout {
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: var(--space-10);
        margin-top: var(--space-6);
      }
      h1 {
        margin-top: var(--space-2);
      }
      .meta {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        color: var(--ink-secondary);
        font-size: var(--text-label-size);
      }
      .description {
        margin-top: var(--space-8);
      }
      .description p {
        color: var(--ink-secondary);
        line-height: 1.7;
        white-space: pre-line;
      }
      .sidebar {
        padding: var(--space-6);
        align-self: start;
      }
      .sidebar h4 {
        margin: 0 0 var(--space-4);
      }
      dl {
        margin: 0;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--space-2) var(--space-4);
      }
      dt {
        color: var(--silver);
        font-size: var(--text-label-size);
        font-weight: 600;
      }
      dd {
        margin: 0;
        text-align: right;
      }
      .apply-btn {
        display: block;
        text-align: center;
        text-decoration: none;
        margin-top: var(--space-6);
      }
      .apply-note {
        color: var(--silver);
        font-size: var(--text-label-size);
        text-align: center;
        margin-top: var(--space-2);
      }
      .subhead {
        color: var(--ink-secondary);
        margin-bottom: var(--space-6);
      }
      @media (max-width: 860px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class JobDetailComponent implements OnInit {
  job = signal<JobDetail | null>(null);
  notFound = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      return;
    }
    this.api.getJob(id).subscribe({
      next: (job) => this.job.set(job),
      error: () => this.notFound.set(true),
    });
  }

  channelLabel(value: string | number): string {
    return channelLabel(value);
  }

  statusLabel(value: string | number): string {
    return jobStatusLabel(value);
  }

  budget(job: JobDetail): string | null {
    return formatBudgetRange(job.budgetMinorMin, job.budgetMinorMax);
  }
}
