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

export interface RegisterClientPayload {
  email: string;
  password: string;
  companyName: string;
  gstin?: string;
}

export interface RegisterClientResponse {
  userId: string;
  profile: {
    companyName: string;
    gstin: string | null;
    plan: string;
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

// --- Auth + dashboards ---------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SessionUser {
  id: string;
  email: string;
  role: 'Freelancer' | 'Client' | 'Admin';
  displayName: string;
  freelancerProfileId?: string | null;
  clientProfileId?: string | null;
  isFullyVerified?: boolean | null;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: SessionUser;
}

export interface MilestoneSummary {
  id: string;
  title: string;
  contractValueMinor: number;
  state: string;
  reviewWindowDays?: number;
  fundedAt?: string | null;
  submittedAt?: string | null;
  reviewDeadlineAt?: string | null;
  releasedAt?: string | null;
}

export interface ContractSummary {
  id: string;
  scopeSummary: string;
  status: string;
  channel?: string;
  jobTitle?: string | null;
  counterpartyName?: string;
  clientName?: string;
  freelancerName?: string;
  freelancerRole?: string;
  createdAt: string;
  contractValueMinor?: number;
  milestones: MilestoneSummary[];
}

export interface RecommendedJob {
  id: string;
  title: string;
  roleCategory: string;
  budgetMinorMin?: number;
  budgetMinorMax?: number;
  clientName: string;
}

export interface FreelancerDashboard {
  profile: {
    id: string;
    displayName: string;
    headline?: string | null;
    primaryRole: string;
    rateBand: string;
    experienceLevel: string;
    hourlyRateMinor?: number | null;
    isFullyVerified: boolean;
    panStatus: string;
    aadhaarStatus: string;
  };
  summary: {
    activeContracts: number;
    totalEarnedMinor: number;
    pendingInEscrowMinor: number;
    openProposalsCount: number;
  };
  contracts: ContractSummary[];
  taxSummary: {
    financialYearStart: string;
    fyToDateEarnedMinor: number;
    totalGstCollectedMinor: number;
    estimatedTdsMinor: number;
    note: string;
  };
  recommendedJobs: RecommendedJob[];
}

export interface PendingApproval {
  id: string;
  contractId: string;
  title: string;
  contractValueMinor: number;
  freelancerName: string;
  submittedAt?: string | null;
  reviewDeadlineAt?: string | null;
}

export interface PostedJob {
  id: string;
  title: string;
  status: string;
  proposalCount: number;
  createdAt: string;
}

export interface ClientDashboard {
  profile: {
    id: string;
    companyName: string;
    gstin?: string | null;
    plan: string;
    negotiatedFeeRate?: number | null;
  };
  summary: {
    activeContracts: number;
    escrowBalanceMinor: number;
    pendingApprovalsCount: number;
    openJobsCount: number;
  };
  contracts: ContractSummary[];
  pendingApprovals: PendingApproval[];
  postedJobs: PostedJob[];
}

export interface FreelancerListItem {
  id: string;
  displayName: string;
  headline?: string | null;
  primaryRole: string;
  rateBand: string;
  experienceLevel: string;
  hourlyRateMinor?: number | null;
  isFullyVerified: boolean;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  roleCategory: string;
  channel?: string;
  budgetMinorMin?: number;
  budgetMinorMax?: number;
}

/** Thin wrapper over the single .NET Web API that also serves the Android and iOS apps. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  registerFreelancer(payload: RegisterFreelancerPayload): Observable<RegisterFreelancerResponse> {
    return this.http.post<RegisterFreelancerResponse>(`${this.baseUrl}/freelancers/register`, payload);
  }

  registerClient(payload: RegisterClientPayload): Observable<RegisterClientResponse> {
    return this.http.post<RegisterClientResponse>(`${this.baseUrl}/clients/register`, payload);
  }

  listOpenJobs(): Observable<JobSummary[]> {
    return this.http.get<JobSummary[]>(`${this.baseUrl}/jobs`);
  }

  getJob(id: string): Observable<JobDetail> {
    return this.http.get<JobDetail>(`${this.baseUrl}/jobs/${id}`);
  }

  // --- Auth + dashboards ---

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  getFreelancerDashboard(): Observable<FreelancerDashboard> {
    return this.http.get<FreelancerDashboard>(`${this.baseUrl}/dashboard/freelancer`);
  }

  getClientDashboard(): Observable<ClientDashboard> {
    return this.http.get<ClientDashboard>(`${this.baseUrl}/dashboard/client`);
  }

  // --- Milestone lifecycle ---

  fundMilestone(id: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/milestones/${id}/fund`, {});
  }

  startMilestone(id: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/milestones/${id}/start`, {});
  }

  submitMilestone(id: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/milestones/${id}/submit`, {});
  }

  approveMilestone(id: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/milestones/${id}/approve`, {});
  }

  // --- Client: find contractors, create a project ---

  searchFreelancers(params: { role?: string; q?: string } = {}): Observable<FreelancerListItem[]> {
    let query = '';
    const parts: string[] = [];
    if (params.role) parts.push(`role=${encodeURIComponent(params.role)}`);
    if (params.q) parts.push(`q=${encodeURIComponent(params.q)}`);
    if (parts.length) query = `?${parts.join('&')}`;
    return this.http.get<FreelancerListItem[]>(`${this.baseUrl}/freelancers${query}`);
  }

  createJob(payload: CreateJobPayload): Observable<{ id: string; title: string; status: string }> {
    return this.http.post<{ id: string; title: string; status: string }>(`${this.baseUrl}/jobs`, payload);
  }

  // --- Freelancer: search + apply ---

  searchJobs(params: { role?: string; q?: string } = {}): Observable<JobSummary[]> {
    const parts: string[] = [];
    if (params.role) parts.push(`role=${encodeURIComponent(params.role)}`);
    if (params.q) parts.push(`q=${encodeURIComponent(params.q)}`);
    const query = parts.length ? `?${parts.join('&')}` : '';
    return this.http.get<JobSummary[]>(`${this.baseUrl}/jobs/search${query}`);
  }

  submitProposal(jobId: string, coverNote: string, proposedRateMinor: number): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/jobs/${jobId}/proposals`, { coverNote, proposedRateMinor });
  }
}
