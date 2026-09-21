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
  channel: string;
  createdAt: string;
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
}
