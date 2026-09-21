import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ApiService, JobSummary } from '../../core/services/api.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container jobs-page">
      <h1>Open jobs</h1>
      @if (jobs().length === 0) {
        <p>No open jobs to show right now.</p>
      }
      <ul class="job-list">
        @for (job of jobs(); track job.id) {
          <li class="job-card">
            <h3>{{ job.title }}</h3>
            <p class="badge">{{ job.roleCategory }} · {{ job.channel }}</p>
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
      .job-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }
      .job-card {
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
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
}
