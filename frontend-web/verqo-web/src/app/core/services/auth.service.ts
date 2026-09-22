import { Injectable, computed, signal } from '@angular/core';

export interface CurrentUser {
  id: string;
  email: string;
  role: 'Freelancer' | 'Client' | 'Admin';
  displayName: string;
  freelancerProfileId?: string | null;
  clientProfileId?: string | null;
  isFullyVerified?: boolean | null;
}

interface StoredSession {
  token: string;
  expiresAt: string;
  user: CurrentUser;
}

const STORAGE_KEY = 'verqo.session';

/**
 * Holds the logged-in session in memory (a signal, read by the header and
 * route guard) and mirrors it to localStorage so a page refresh doesn't
 * silently log the user out. The token itself is attached to outgoing API
 * calls by AuthInterceptor, not read directly by feature components.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<StoredSession | null>(this.restore());

  readonly currentUser = computed<CurrentUser | null>(() => this.session()?.user ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);
  readonly token = computed(() => this.session()?.token ?? null);

  setSession(token: string, expiresAt: string, user: CurrentUser): void {
    const value: StoredSession = { token, expiresAt, user };
    this.session.set(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Private-browsing/blocked storage — session still works for this tab
      // via the in-memory signal, it just won't survive a refresh.
    }
  }

  logout(): void {
    this.session.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Same rationale as setSession's catch — nothing to clean up if it
      // never wrote in the first place.
    }
  }

  private restore(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredSession;
      if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }
}
