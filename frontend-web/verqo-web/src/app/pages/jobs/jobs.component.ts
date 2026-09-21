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
        padding: 64px 24px;
        max-width: 760px;
      }
      .job-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .job-card {
        border: 1px solid var(--verqo-silver-light);
        border-radius: 12px;
        padding: 20px;
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
