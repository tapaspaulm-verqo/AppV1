import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, JobSummary } from '../../core/services/api.service';
import { channelLabel, formatBudgetRange } from '../../core/utils/job-labels';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container jobs-page">
      <p class="badge">Find work</p>
      <h1>Open jobs</h1>
      <p class="subhead">Verified freelancers can apply once signed in. Browse what's open right now.</p>

      @if (jobs().length === 0) {
        <p class="empty">No open jobs to show right now — check back soon.</p>
      }
      <ul class="job-list">
        @for (job of jobs(); track job.id) {
          <li>
            <a [routerLink]="['/jobs', job.id]" class="job-card">
              <div class="job-card-head">
                <h3>{{ job.title }}</h3>
                @if (budget(job); as range) {
                  <span class="text-data">{{ range }}</span>
                }
              </div>
              <p class="badge">{{ job.roleCategory }} · {{ channel(job.channel) }}</p>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  styles: [
    `
      .jobs-page {
        padding: var(--space-16) var(--space-6);
        max-width: 760px;
      }
      .subhead {
        color: var(--ink-secondary);
        margin-top: var(--space-2);
      }
      .empty {
        color: var(--ink-secondary);
        margin-top: var(--space-6);
      }
      .job-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        margin-top: var(--space-8);
      }
      .job-card {
        display: block;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
        text-decoration: none;
        color: var(--ink);
        transition: border-color 0.15s ease;
      }
      .job-card:hover {
        border-color: var(--silver);
      }
      .job-card-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-4);
      }
      .job-card-head h3 {
        margin: 0;
      }
    `,
  ],
})
export class JobsComponent implements OnInit {
  jobs = signal<JobSummary[]>([]);

  constructor(private readonly api: ApiService) {}

  ngOnInit(): void {
    this.api.listOpenJobs().subscribe({
      next: (jobs) => this.jobs.set(jobs),
      error: () => this.jobs.set([]),
    });
  }

  channel(value: string | number): string {
    return channelLabel(value);
  }

  budget(job: JobSummary): string | null {
    return formatBudgetRange(job.budgetMinorMin, job.budgetMinorMax);
  }
}
