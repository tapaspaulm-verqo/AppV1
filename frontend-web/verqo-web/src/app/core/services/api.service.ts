import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterFreelancerPayload {
  email: string;
  password: string;
  displayName: string;
  primaryRole: string;
  panNumber: string;
  aadhaarNumber: string;
  epfUan?: string;
}

export interface RegisterFreelancerResponse {
  userId: string;
  profile: {
    displayName: string;
    panStatus: string;
    aadhaarStatus: string;
    epfStatus: string;
    isFullyVerified: boolean;
  };
}

export interface JobSummary {
  id: string;
  title: string;
  roleCategory: string;
  budgetMinorMin?: number;
  budgetMinorMax?: number;
  channel: string | number;
  createdAt: string;
}

/** Full Job entity as returned by GET /jobs/{id} — includes the fields the
 * list endpoint omits (description, status), and does not call .ToString()
 * on its enum fields, so channel/status arrive as numbers today. */
export interface JobDetail {
  id: string;
  clientId: string;
  title: string;
  description: string;
  roleCategory: string;
  channel: string | number;
  status: string | number;
  budgetMinorMin?: number;
  budgetMinorMax?: number;
  createdAt: string;
  updatedAt: string;
}

/** Thin wrapper over the single .NET Web API that also serves the Android and iOS apps. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  registerFreelancer(payload: RegisterFreelancerPayload): Observable<RegisterFreelancerResponse> {
    return this.http.post<RegisterFreelancerResponse>(`${this.baseUrl}/freelancers/register`, payload);
  }

  listOpenJobs(): Observable<JobSummary[]> {
    return this.http.get<JobSummary[]>(`${this.baseUrl}/jobs`);
  }

  getJob(id: string): Observable<JobDetail> {
    return this.http.get<JobDetail>(`${this.baseUrl}/jobs/${id}`);
  }
}
