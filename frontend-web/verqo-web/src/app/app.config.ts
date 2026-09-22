import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // Angular Router does nothing about scroll position by default — a
      // routerLink navigation is a same-document pushState, not a real page
      // load, so the browser has no reason to reset scrollY on its own. Left
      // unconfigured, navigating to a new page (e.g. a long legal page) from
      // partway down another page lands the visitor wherever they happened
      // to be scrolled to, not at the top of the new page — a real, user-
      // reported bug, not a hypothetical one (verified: scrolling to 2500px
      // on Home then clicking through to /legal/terms landed at scrollY
      // 2500 instead of 0). `scrollPositionRestoration: 'enabled'` scrolls
      // to top on every new navigation and restores the prior position on
      // back/forward; `anchorScrolling: 'enabled'` makes the same true for
      // routerLink+fragment navigation (the legal pages' own in-page anchor
      // links are plain `<a href="#id">`, which the browser already
      // handles natively, but this covers any [routerLink][fragment] usage
      // too and costs nothing).
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(),
  ],
};
