import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Verqo's Privacy Policy — the full "Draft v0.1 for legal review" text
 * prepared for Verqo India Private Limited, reproduced here as the real
 * content for /legal/privacy.
 *
 * As with the Terms of Use, this is the actual draft policy supplied for
 * publishing (what's collected, why, the PF/employment-eligibility check,
 * who it's shared with, retention, DPDP Act rights, cookies, grievance
 * redressal), not content invented for this page. It's still explicitly a
 * pre-review draft — bracketed placeholders (registered office address,
 * CIN, Grievance Officer name/contact, exact retention periods) are exactly
 * as drafted. The source document's "notes for legal review" checklist and
 * the internal sign-up-screen consent-copy annex are left out of this
 * public page, since neither is part of the policy itself.
 */
@Component({
  selector: 'app-legal-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="legal-page container">
      <span class="status-pill status-pill--pending">Draft v0.1 — pending legal review</span>
      <h1>Privacy Policy</h1>
      <p class="meta">Verqo India Private Limited · verqo.in · Effective date: [to be inserted]</p>
      <p class="intro">
        This is Verqo's draft Privacy Policy, prepared for review by Indian legal counsel before it
        takes effect. It has not been reviewed by a lawyer and should not be relied on as binding
        until it has. It is written to follow the Digital Personal Data Protection Act, 2023 (DPDP
        Act) and the rules made under it.
      </p>

      <div class="key-points">
        <h4>Privacy at a glance</h4>
        <p class="key-points-note">This summary is not part of the legal policy.</p>
        <dl>
          <dt>Who we are</dt>
          <dd>Verqo India Private Limited, the data fiduciary for the Verqo website and apps.</dd>
          <dt>What we collect</dt>
          <dd>Your account and profile details, identity and bank verification details, contract and payment records, and usage data.</dd>
          <dt>Why</dt>
          <dd>To verify you, connect you with work or talent, run escrow and payouts, keep the Platform safe, and follow the law.</dd>
          <dt>Employment check</dt>
          <dd>With your consent we check that you have no active PF account with a current employer. We keep only the result and date.</dd>
          <dt>Who sees it</dt>
          <dd>Service providers who work for us, our payment partner, the other party to your contract (limited profile details only), and authorities where the law requires. We do not sell personal data.</dd>
          <dt>Where it is stored</dt>
          <dd>In India, on Google Cloud (Mumbai and Delhi).</dd>
          <dt>Your rights</dt>
          <dd>Access, correction, erasure, grievance redressal, and nomination. Write to our Grievance Officer at [privacy email address].</dd>
        </dl>
      </div>

      <nav class="toc">
        <h4>Contents</h4>
        <a href="#about">1. About this Policy</a>
        <a href="#data-we-collect">2. Personal data we collect</a>
        <a href="#how-we-use">3. How and why we use personal data</a>
        <a href="#pf-check">4. Employment (PF) eligibility check</a>
        <a href="#consent">5. Consent and withdrawing it</a>
        <a href="#sharing">6. Who we share personal data with</a>
        <a href="#storage">7. Where data is stored and international access</a>
        <a href="#retention">8. How long we keep personal data</a>
        <a href="#security">9. How we protect personal data</a>
        <a href="#rights">10. Your rights</a>
        <a href="#children">11. Children</a>
        <a href="#cookies">12. Cookies and similar technologies</a>
        <a href="#automated">13. Automated tools and AI</a>
        <a href="#links">14. Links to other services</a>
        <a href="#grievance">15. Grievance Officer and contact</a>
        <a href="#changes">16. Changes to this Policy</a>
      </nav>

      <article class="legal-body">
        <h2 id="about">1. About this Policy</h2>
        <p><strong>1.1</strong> Verqo India Private Limited ("Verqo", "we", "us") operates the Verqo website at verqo.in and the Verqo Android and iOS applications (the "Platform"). We are the "data fiduciary" for personal data that we collect and decide how to use through the Platform. Our registered office is at [registered office address] (CIN [to be inserted]).</p>
        <p><strong>1.2</strong> This Policy explains what personal data we collect, why, how we use and protect it, who we share it with, how long we keep it, and what rights you have. It applies to Freelancers, to individuals who use the Platform for a Client, and to visitors. It is written to follow the Digital Personal Data Protection Act, 2023 and the rules made under it, and other applicable Indian law.</p>
        <p><strong>1.3</strong> Terms such as "Freelancer", "Client" and "Contract" have the meanings given in our <a routerLink="/legal/terms">Terms of Use</a>. "Personal data" means any data about an individual who is identifiable from it.</p>
        <p><strong>1.4</strong> When we need your consent, we ask for it clearly and separately. By using the Platform you confirm that you have read this Policy.</p>

        <h2 id="data-we-collect">2. Personal data we collect</h2>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Category</th><th>Examples</th><th>Where it comes from</th></tr></thead>
          <tbody>
            <tr><td>Account and contact</td><td>Name, email address, mobile number, password (stored securely), role, profile photo; for Clients, company name, designation and GST number</td><td>You</td></tr>
            <tr><td>Freelancer profile</td><td>Skills, experience, work history, portfolio, certifications, rates, availability, links, ratings and reviews</td><td>You; other users (reviews)</td></tr>
            <tr><td>Identity and KYC</td><td>Government ID details as permitted by law (such as PAN), date of birth, selfie or liveness image, verification result and reference</td><td>You; licensed verification partner</td></tr>
            <tr><td>Bank and payout</td><td>Bank account number and IFSC, account holder name, UPI ID, verification result</td><td>You; verification and payment partners</td></tr>
            <tr><td>Employment eligibility</td><td>Your declaration; the result of the PF status check (eligible, not eligible, needs review), the date, and the partner's reference</td><td>You; licensed verification partner</td></tr>
            <tr><td>Contract and payment</td><td>Contracts, milestones, timesheets, invoices, amounts, ledger entries, payment and payout references (such as UTR)</td><td>You; the other party; Payment Partner</td></tr>
            <tr><td>Communications</td><td>Messages, files, dispute evidence, support requests</td><td>You; the other party</td></tr>
            <tr><td>Usage and device</td><td>IP address, device and app identifiers, app version, log data, pages and features used, approximate location from IP address, cookie data</td><td>Your device and use of the Platform</td></tr>
            <tr><td>Gig worker registration</td><td>Details the law requires us to give a government portal for registering gig and platform workers</td><td>You; our records</td></tr>
          </tbody>
        </table>
        </div>
        <p class="table-note">We do not need and ask you not to upload information such as religion, caste, health or political views. We do not store full card numbers; card payments are handled by the Payment Partner.</p>

        <h2 id="how-we-use">3. How and why we use personal data</h2>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Purpose</th><th>Main data used</th><th>Basis</th></tr></thead>
          <tbody>
            <tr><td>Create and run your account and provide the Platform</td><td>Account, profile, contract data</td><td>Your consent; you gave us the data for this purpose</td></tr>
            <tr><td>Verify identity, bank account, profile and employment eligibility; prevent fraud and duplicate accounts</td><td>Identity, bank, employment eligibility, device data</td><td>Your consent; legal obligations</td></tr>
            <tr><td>Match Freelancers with jobs, show profiles and give recommendations</td><td>Profile, usage data</td><td>Your consent</td></tr>
            <tr><td>Run contracts, escrow, payouts and invoices</td><td>Contract, payment, bank data</td><td>Your consent; legal obligations for tax and accounts</td></tr>
            <tr><td>Comply with law, including tax, accounting, anti-money-laundering, gig worker registration, and orders of courts or authorities</td><td>Identity, payment, registration data</td><td>Legal obligations</td></tr>
            <tr><td>Send service messages, security alerts and, only if you agree, marketing</td><td>Contact, usage data</td><td>Service messages: your consent at sign-up; marketing: separate consent</td></tr>
            <tr><td>Keep the Platform secure, detect and respond to incidents, and keep security logs</td><td>Usage, device, account data</td><td>Security safeguards; legal obligations</td></tr>
            <tr><td>Resolve disputes and provide support</td><td>Contract, communications data</td><td>Your consent; legal claims</td></tr>
            <tr><td>Improve and analyse the Platform, using de-identified data where possible</td><td>Usage data</td><td>Your consent</td></tr>
          </tbody>
        </table>
        </div>

        <h2 id="pf-check">4. Employment (PF) eligibility check</h2>
        <p><strong>4.1</strong> Why. Verqo is intended for professionals who are not in full-time employment. We therefore check whether a Freelancer has an active Provident Fund account with a current employer.</p>
        <p><strong>4.2</strong> How. With your specific consent, a licensed verification partner checks your PF status for us. You may be asked to provide identifiers or an OTP that the partner needs [confirm the method].</p>
        <p><strong>4.3</strong> What we keep. We keep the result (eligible, not eligible, or needs review), the date of the check and the partner's reference. We do not keep your PF contribution history or passbook [confirm].</p>
        <p><strong>4.4</strong> An old PF account, or a Universal Account Number without current employer contributions, does not by itself make you ineligible.</p>
        <p><strong>4.5</strong> Human review. We do not reject or remove a Freelancer only because of an automated result. If the result shows you as ineligible or it is unclear, a member of our team will review it, and you can send us more information or ask for a review.</p>
        <p><strong>4.6</strong> Later checks. We may repeat the check from time to time, and we will tell you when we do.</p>
        <p><strong>4.7</strong> You can withdraw your consent, but we may then be unable to keep your Freelancer account active.</p>

        <h2 id="consent">5. Consent and withdrawing it</h2>
        <p><strong>5.1</strong> Where we rely on your consent, it will be free, specific, informed and given by a clear action, such as ticking a box. We will present the notice in English and, when available, in other Indian languages. Consent for optional purposes, such as marketing and analytics, is separate, and you can say no without losing access to the Platform.</p>
        <p><strong>5.2</strong> You can withdraw consent at any time, as easily as you gave it, in Settings under Privacy or by writing to [privacy email address]. Withdrawal does not affect processing done before, and it may mean we cannot provide some services. After withdrawal we will stop processing, and ask our service providers to stop, unless the law requires us to keep the data.</p>

        <h2 id="sharing">6. Who we share personal data with</h2>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Recipient</th><th>Why</th><th>What they receive</th></tr></thead>
          <tbody>
            <tr><td>Cloud and technology providers (for example Google Cloud)</td><td>Hosting, security and operations</td><td>Data needed to run the Platform, held in India</td></tr>
            <tr><td>Payment Partner and its bank</td><td>Collection, escrow, split settlement, payouts and refunds</td><td>Name, bank or UPI details, payment and contract amounts</td></tr>
            <tr><td>Verification partners</td><td>KYC, bank, profile and employment eligibility checks</td><td>Data needed for each check, with your consent</td></tr>
            <tr><td>Communication providers</td><td>Email, SMS and push messages</td><td>Contact details and message content</td></tr>
            <tr><td>The other party to a Contract</td><td>To form and carry out the Contract</td><td>Name, profile, company, ratings and contract details. Not your ID documents, bank details or PF check result</td></tr>
            <tr><td>Professional advisers and auditors</td><td>Legal, tax, audit and insurance</td><td>Only what is needed, under confidentiality</td></tr>
            <tr><td>Government, regulators, courts and law enforcement</td><td>Where the law requires or allows, including gig worker registration</td><td>Data the law requires</td></tr>
            <tr><td>A buyer or successor to our business</td><td>Sale, merger or restructuring</td><td>Data under the same protections as this Policy</td></tr>
          </tbody>
        </table>
        </div>
        <p><strong>6.1</strong> We do not sell your personal data. Service providers act on our instructions under contracts that require confidentiality and security.</p>

        <h2 id="storage">7. Where data is stored and international access</h2>
        <p><strong>7.1</strong> We store personal data in India, on Google Cloud in Mumbai and Delhi. The Payment Partner stores payment data in India as required by Reserve Bank of India rules.</p>
        <p><strong>7.2</strong> Clients outside India can see the profile information you choose to make visible on the Platform. We transfer personal data outside India only as the law permits and with suitable safeguards.</p>

        <h2 id="retention">8. How long we keep personal data</h2>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Data</th><th>Retention</th></tr></thead>
          <tbody>
            <tr><td>Account and profile</td><td>While your account is active. Deleted or anonymised within [90] days after closure, unless the law requires us to keep it.</td></tr>
            <tr><td>KYC and verification records</td><td>[Period to be confirmed by counsel; proposed 5 years after account closure] as required by law</td></tr>
            <tr><td>Transaction, ledger and invoice records</td><td>[8 years] for financial and tax records</td></tr>
            <tr><td>Contracts, messages and dispute evidence</td><td>[3 years] after the Contract ends</td></tr>
            <tr><td>Security and access logs</td><td>At least one year, as the DPDP Rules require</td></tr>
            <tr><td>Support requests</td><td>[2 years] after the request is closed</td></tr>
            <tr><td>Marketing preferences</td><td>Until you withdraw consent</td></tr>
          </tbody>
        </table>
        </div>
        <p class="table-note">When the purpose has been served and no law requires us to keep the data, we delete it or remove details that identify you.</p>

        <h2 id="security">9. How we protect personal data</h2>
        <p><strong>9.1</strong> We use reasonable security safeguards, including encryption in transit and at rest, customer-managed encryption keys, field-level encryption for sensitive data, role-based access with multi-factor authentication for staff, network protections, activity logging, regular security testing, and checks on our service providers.</p>
        <p><strong>9.2</strong> If a personal data breach occurs, we will investigate promptly, notify the Data Protection Board of India and affected individuals as the law requires, and take steps to reduce harm.</p>

        <h2 id="rights">10. Your rights</h2>
        <p><strong>10.1</strong> Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
        <ul>
          <li>get a summary of the personal data we process about you, how we process it, and who we have shared it with;</li>
          <li>correct inaccurate or misleading data, complete it and update it;</li>
          <li>ask us to erase your personal data, unless we need to keep it for a lawful purpose;</li>
          <li>have your grievance handled by us; and</li>
          <li>nominate another person to exercise your rights if you die or become unable to do so.</li>
        </ul>
        <p><strong>10.2</strong> To use these rights, go to Settings under Privacy or write to [privacy email address]. We may need to verify your identity. We aim to respond within [30] days, and in any case within the period the law sets. Some rights may be limited where we must keep data by law.</p>
        <p><strong>10.3</strong> If you are not satisfied with our response, you can contact our Grievance Officer (Section 15), and after that you may complain to the Data Protection Board of India.</p>
        <p><strong>10.4</strong> You must give accurate information, not impersonate anyone, and not make false or frivolous complaints.</p>

        <h2 id="children">11. Children</h2>
        <p><strong>11.1</strong> The Platform is for people aged 18 and over. We do not knowingly collect personal data of children. If we learn we hold it, we will delete it.</p>

        <h2 id="cookies">12. Cookies and similar technologies</h2>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Type</th><th>Purpose</th><th>Your choice</th></tr></thead>
          <tbody>
            <tr><td>Essential</td><td>Sign-in, security, load balancing, remembering your session</td><td>Always on; required for the Platform to work</td></tr>
            <tr><td>Preference</td><td>Language and display settings</td><td>You can turn these off in settings</td></tr>
            <tr><td>Analytics</td><td>Understand how the Platform is used so we can improve it</td><td>Off until you agree</td></tr>
            <tr><td>Marketing</td><td>Not used at launch [confirm]</td><td>Would need your consent first</td></tr>
          </tbody>
        </table>
        </div>

        <h2 id="automated">13. Automated tools and AI</h2>
        <p><strong>13.1</strong> We use automated tools for matching and recommendations, fraud detection and verification. We do not take decisions that have legal or similarly significant effects on you, such as rejecting or removing a Freelancer, without a human review.</p>
        <p><strong>13.2</strong> We do not use the deliverables, messages or confidential files that Clients and Freelancers exchange on the Platform to train AI models [confirm].</p>

        <h2 id="links">14. Links to other services</h2>
        <p><strong>14.1</strong> The Platform may link to other websites or services. We are not responsible for their privacy practices, and we encourage you to read their policies.</p>

        <h2 id="grievance">15. Grievance Officer and contact</h2>
        <div class="table-scroll">
        <table>
          <tbody>
            <tr><td>Grievance Officer</td><td>[Name], [Designation]</td></tr>
            <tr><td>Email</td><td>[privacy email address]</td></tr>
            <tr><td>Address</td><td>[registered office address]</td></tr>
            <tr><td>Phone and hours</td><td>[number], [days and hours]</td></tr>
            <tr><td>Data Protection Officer</td><td>[to be named if appointed]</td></tr>
            <tr><td>Response times</td><td>Acknowledgement within [48 hours]; resolution within [30] days and in any case within the period the law sets</td></tr>
          </tbody>
        </table>
        </div>

        <h2 id="changes">16. Changes to this Policy</h2>
        <p><strong>16.1</strong> We may update this Policy. For material changes we will notify you by email or in the Platform, and ask for consent again where the law requires. The effective date is at the top of this Policy, and earlier versions are available on request.</p>
      </article>

      <div class="legal-footer">
        <a routerLink="/legal/terms" class="text-link">← Terms of use</a>
        <a routerLink="/" class="btn btn-secondary">Back to home</a>
      </div>
    </section>
  `,
  styles: [
    `
      .legal-page {
        padding: var(--space-16) var(--space-6);
        max-width: 800px;
      }
      h1 {
        margin-top: var(--space-4);
      }
      .meta {
        color: var(--silver);
        font-size: var(--text-label-size);
      }
      .intro {
        color: var(--ink-secondary);
        line-height: 1.6;
        margin-top: var(--space-4);
      }
      .key-points {
        background: var(--surface-200);
        border-radius: var(--radius-md);
        padding: var(--space-5) var(--space-6);
        margin-top: var(--space-6);
      }
      .key-points h4 {
        margin: 0;
        font-size: var(--text-label-size);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--silver);
      }
      .key-points-note {
        color: var(--silver);
        font-size: var(--text-label-size);
        margin: var(--space-1) 0 var(--space-4);
        font-style: italic;
      }
      .key-points dl {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      .key-points dt {
        font-weight: 700;
        color: var(--ink);
        margin-top: var(--space-3);
      }
      .key-points dd {
        margin: 0;
        color: var(--ink-secondary);
        line-height: 1.6;
      }
      .toc {
        background: var(--surface-200);
        border-radius: var(--radius-md);
        padding: var(--space-5) var(--space-6);
        margin: var(--space-8) 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      .toc h4 {
        margin: 0 0 var(--space-2);
        font-size: var(--text-label-size);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--silver);
      }
      .toc a {
        color: var(--ink-secondary);
        text-decoration: none;
        font-size: var(--text-body-size);
      }
      .toc a:hover {
        color: var(--ink);
        text-decoration: underline;
      }
      .legal-body h2 {
        margin-top: var(--space-10);
        scroll-margin-top: var(--space-6);
      }
      .legal-body p,
      .legal-body li {
        color: var(--ink-secondary);
        line-height: 1.7;
      }
      .legal-body p strong:first-child {
        color: var(--ink);
      }
      .legal-body ul {
        padding-left: var(--space-5);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .legal-body a {
        color: var(--ink);
        font-weight: 600;
      }
      /* These fee/annex tables have a nowrap first column (below) and
         several other columns, which adds up to wider than a phone
         viewport. Without this, the table forces the WHOLE PAGE to scroll
         horizontally on mobile, not just the table — found via a mobile
         crawl (scrollWidth 612px vs a 320px viewport). Wrapping each
         table in this scrollable container keeps the rest of the page
         fixed-width and gives mobile users a normal way to see the extra
         columns (swipe the table, not the page).

         Deliberately NOT 'table-layout: fixed' on the table itself: that
         forces every column to an equal, often too-narrow width, and
         unbreakable words (e.g. "Registration") then overflow visibly
         into the neighbouring column instead of wrapping — worse than
         the scroll it was meant to avoid. Auto layout (the default) never
         does that; it only ever makes the table wider, which this wrapper
         safely contains. */
      .table-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .legal-body table {
        width: 100%;
        border-collapse: collapse;
        margin-top: var(--space-4);
        font-size: var(--text-body-size);
      }
      .legal-body table th,
      .legal-body table td {
        text-align: left;
        padding: var(--space-3) var(--space-4);
        border-bottom: 1px solid var(--border-subtle);
        color: var(--ink-secondary);
        vertical-align: top;
      }
      .legal-body table th {
        color: var(--ink);
        font-weight: 700;
        background: var(--surface-200);
      }
      .legal-body table td:first-child {
        color: var(--ink);
        font-weight: 600;
      }
      .table-note {
        font-size: var(--text-label-size);
        color: var(--silver);
        font-style: italic;
        margin-top: var(--space-2);
      }
      .legal-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        margin-top: var(--space-12);
        padding-top: var(--space-6);
        border-top: 1px solid var(--border-subtle);
        flex-wrap: wrap;
      }
      .legal-footer a.text-link {
        text-decoration: none;
        font-weight: 600;
        color: var(--ink);
      }
      .legal-footer .btn {
        text-decoration: none;
      }
    `,
  ],
})
export class LegalPrivacyComponent {}
