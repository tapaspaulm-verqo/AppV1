import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ClientSignupComponent } from './pages/client-signup/client-signup.component';
import { ForBusinessComponent } from './pages/for-business/for-business.component';
import { ForFreelancersComponent } from './pages/for-freelancers/for-freelancers.component';
import { FreelancerSignupComponent } from './pages/freelancer-signup/freelancer-signup.component';
import { HomeComponent } from './pages/home/home.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { JobDetailComponent } from './pages/job-detail/job-detail.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { TrustSafetyComponent } from './pages/trust-safety/trust-safety.component';
import { ComingSoonComponent } from './shared/coming-soon/coming-soon.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Real, content-backed marketing pages
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'freelancers', component: ForFreelancersComponent },
  { path: 'business', component: ForBusinessComponent },
  { path: 'trust-safety', component: TrustSafetyComponent },
  { path: 'about', component: AboutComponent },

  // Product pages wired to the real API
  { path: 'jobs', component: JobsComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'signup/freelancer', component: FreelancerSignupComponent },
  { path: 'signup/client', component: ClientSignupComponent },

  // Pages with no backing API/content yet — generic placeholder,
  // clearly marked "to be updated" rather than a silent dead link.
  {
    path: 'talent',
    component: ComingSoonComponent,
    data: {
      title: 'Find talent',
      blurb:
        "A searchable directory of verified freelancer profiles is coming. For now, post a role and we'll match verified freelancers to it.",
      cta: { label: 'Hire talent', link: '/signup/client' },
    },
  },
  {
    path: 'login',
    component: ComingSoonComponent,
    data: {
      title: 'Log in',
      blurb: 'Account login is coming soon. New here? Create a freelancer or client account instead.',
      cta: { label: 'Join as a freelancer', link: '/signup/freelancer' },
    },
  },
  {
    path: 'dashboard',
    component: ComingSoonComponent,
    data: {
      title: 'Dashboard',
      blurb:
        'Your contracts, milestones and earnings will live here once you have an account and an active contract.',
      cta: { label: 'Join as a freelancer', link: '/signup/freelancer' },
    },
  },
  {
    path: 'messages',
    component: ComingSoonComponent,
    data: {
      title: 'Messages',
      blurb: 'In-app messaging between clients and freelancers is coming.',
    },
  },
  {
    path: 'enterprise',
    component: ComingSoonComponent,
    data: {
      title: 'Enterprise',
      blurb:
        "Dedicated support and terms for larger hiring teams are on our roadmap. Business Plus is available today for teams hiring at scale.",
      cta: { label: 'See pricing', link: '/pricing' },
    },
  },
  {
    path: 'contact',
    component: ComingSoonComponent,
    data: {
      title: 'Contact us',
      blurb: "We're setting up dedicated support channels. In the meantime, reach out through your account once you've signed up.",
    },
  },
  {
    path: 'help',
    component: ComingSoonComponent,
    data: {
      title: 'Help center',
      blurb: 'A full help center with guides for freelancers and clients is coming.',
      cta: { label: 'Read how it works', link: '/how-it-works' },
    },
  },
  {
    path: 'careers',
    component: ComingSoonComponent,
    data: {
      title: 'Careers',
      blurb: "We're not listing open roles yet — check back as Verqo grows.",
    },
  },
  {
    path: 'resources',
    component: ComingSoonComponent,
    data: {
      title: 'Blog & resources',
      blurb: 'Guides on freelancing, hiring and getting the most out of Verqo are coming.',
    },
  },
  {
    path: 'legal/terms',
    component: ComingSoonComponent,
    data: {
      title: 'Terms of service',
      blurb: "Verqo's terms of service are being finalized with legal counsel before publishing.",
      note: 'Contract and fee terms already shown on Pricing and How it works reflect the current business plan.',
    },
  },
  {
    path: 'legal/privacy',
    component: ComingSoonComponent,
    data: {
      title: 'Privacy policy',
      blurb: "Verqo's privacy policy is being finalized before publishing.",
      note: 'Note: PAN is validated by format and checksum; Aadhaar is checksum-validated and only its last 4 digits are ever stored.',
    },
  },

  { path: '**', redirectTo: '' },
];
