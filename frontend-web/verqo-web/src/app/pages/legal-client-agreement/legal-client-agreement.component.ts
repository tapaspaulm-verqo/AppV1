import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Verqo's Client Agreement — the full "Draft v0.1 for legal review" text,
 * including the Standard Engagement Terms (Annex C, shared with the
 * Freelancer Agreement) and the Business Plus Order Form template and
 * onboarding-document list. Referenced from the Terms of Use (Clause 1.2)
 * as the document that governs the relationship between a Client and Verqo.
 *
 * Real draft content supplied for publishing, not invented. Bracketed
 * placeholders are exactly as drafted. The source document's internal
 * "notes for legal review" checklist is left out of this public page.
 */
@Component({
  selector: 'app-legal-client-agreement',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="legal-page container">
      <span class="status-pill status-pill--pending">Draft v0.1 — pending legal review</span>
      <p class="badge badge-client">For clients</p>
      <h1>Client Agreement</h1>
      <p class="meta">Verqo India Private Limited · verqo.in · Effective date: [to be inserted]</p>
      <p class="intro">
        This is Verqo's draft Client Agreement — the agreement you accept when you register as a
        Client, on top of the <a routerLink="/legal/terms">Terms of Use</a>. It has not been
        reviewed by a lawyer and should not be relied on as binding until it has.
      </p>

      <div class="key-points">
        <h4>Key points in plain language</h4>
        <p class="key-points-note">This summary is not part of the legal terms.</p>
        <ol>
          <li>Verqo is a marketplace. You contract directly with verified Freelancers, and Verqo provides the platform, escrow and payment services.</li>
          <li>There is no registration fee and no subscription. On the Standard Business plan the Client Fee is 10% of contract value, added to the amount you fund. Business Plus is agreed by volume and can go as low as 5%, with dedicated support.</li>
          <li>You fund each milestone into escrow before work starts. Funds are released when you approve, or automatically after the review window. Disputes freeze the funds until resolved.</li>
          <li>Freelancers are independent contractors. Please do not manage them as employees.</li>
          <li>You own the work product once the funds are released. Keep contracts, communication and payments on Verqo.</li>
        </ol>
      </div>

      <nav class="toc">
        <h4>Contents</h4>
        <a href="#parties">1. Parties and structure</a>
        <a href="#provides">2. What Verqo provides</a>
        <a href="#onboarding">3. Onboarding and eligibility</a>
        <a href="#fees">4. Plans and fees</a>
        <a href="#contracts">5. Contracts and milestones</a>
        <a href="#escrow">6. Escrow and payment</a>
        <a href="#relationship">7. Your relationship with Freelancers</a>
        <a href="#ip">8. Intellectual property and confidentiality</a>
        <a href="#acceptable-use">9. Acceptable use</a>
        <a href="#data">10. Personal data</a>
        <a href="#availability">11. Availability and support</a>
        <a href="#termination">12. Term and termination</a>
        <a href="#liability">13. Warranties, liability and indemnity</a>
        <a href="#grievance">14. Grievances, governing law and disputes</a>
        <a href="#general">15. General</a>
        <a href="#annex-a">Annex A: Fee schedule</a>
        <a href="#annex-b">Annex B: Business Plus Order Form (template)</a>
        <a href="#annex-c">Annex C: Standard Engagement Terms</a>
        <a href="#annex-d">Annex D: Client onboarding documents</a>
      </nav>

      <article class="legal-body">
        <h2 id="parties">1. Parties and structure</h2>
        <p><strong>1.1</strong> This Client Agreement ("Agreement") is between Verqo India Private Limited, a company incorporated in India with its registered office at [registered office address] (CIN [to be inserted]) ("Verqo"), and the business or organisation that accepts it (the "Client", "you").</p>
        <p><strong>1.2</strong> This Agreement is made up of these terms, the Verqo <a routerLink="/legal/terms">Terms of Use</a> and <a routerLink="/legal/privacy">Privacy Policy</a>, the Standard Engagement Terms (Annex C), and, for Business Plus, the signed Order Form (Annex B). If they conflict, the Order Form prevails, then this Agreement, then the Terms of Use. The Standard Engagement Terms apply between you and each Freelancer unless your Contract says otherwise.</p>
        <p><strong>1.3</strong> Words in capital letters, such as Freelancer, Contract, Milestone, Contract Value, Escrow Account, Payment Partner, Platform Fees and Review Window, have the meanings given in the Terms of Use.</p>
        <p><strong>1.4</strong> The person accepting for the Client confirms they are authorised to bind it. Acceptance is electronic under the Information Technology Act, 2000 and needs no signature.</p>

        <h2 id="provides">2. What Verqo provides</h2>
        <p><strong>2.1</strong> Verqo provides access to the Platform, verified Freelancers, tools to post jobs and manage Contracts and timesheets, escrow and payment administration through the Payment Partner, tax invoices for Verqo's fees, a dispute process, and support as set out in this Agreement.</p>
        <p><strong>2.2</strong> B2B and B2C. You may use the B2B channel to have a project delivered by a service provider, or the B2C channel to engage Freelancers directly. Both use the same escrow, fee and dispute rules.</p>
        <p><strong>2.3</strong> Verqo is an intermediary. It is not a party to your Contracts, is not the employer or agent of any Freelancer, and does not direct or supervise the work. Verqo does not guarantee that any Freelancer will deliver, the quality or legality of work, or that any work will be available. Verification of Freelancers is a screening step and not a guarantee.</p>

        <h2 id="onboarding">3. Onboarding and eligibility</h2>
        <p><strong>3.1</strong> You must be a legally constituted business or organisation, or an individual acting for one, with the authority to enter Contracts. Verqo and the Payment Partner may verify your business (for example incorporation, PAN, GST registration, authorised signatory and bank account) before you can fund a Milestone. Annex D lists the documents.</p>
        <p><strong>3.2</strong> You must give accurate and current information and keep it up to date. You are responsible for all activity under your account, including by your authorised users, and must keep credentials secure and remove users who leave.</p>
        <p><strong>3.3</strong> You must comply with applicable law, including sanctions and anti-money-laundering rules. Verqo may refuse or end access where it cannot complete verification or where the law requires.</p>

        <h2 id="fees">4. Plans and fees</h2>
        <p><strong>4.1</strong> No registration or subscription fee. Verqo charges you no registration fee and no subscription fee. Fees are charged only on funded work.</p>
        <p><strong>4.2</strong> Standard Business plan. The Client Fee is <span class="badge badge-client">10%</span> of the Contract Value. It is added to the amount you fund for each Milestone.</p>
        <p><strong>4.3</strong> Business Plus. Business Plus is a volume-based plan agreed in an Order Form. The Client Fee reduces from 10% by contract volume to a minimum of <span class="badge badge-client">5%</span> of the Contract Value, and includes dedicated support. Verqo sets the volume thresholds [to be published; see Annex A] and measures volume by the Contract Value funded in [each 12-month period]. Verqo may review the plan each [12 months], and may move you back to the Standard Business plan if volume falls below the threshold for your rate.</p>
        <p><strong>4.4</strong> Fees are shown before you fund. The amount the Freelancer will receive is also shown. Verqo does not charge other undisclosed fees.</p>
        <p><strong>4.5</strong> Freelancer Fee. Freelancers pay Verqo a separate fixed fee of 5% of the Contract Value, deducted from their payment. It does not increase the amount you pay.</p>
        <p><strong>4.6</strong> Taxes. The Client Fee is [inclusive / exclusive] of GST [confirm]. Verqo will issue a tax invoice to you for the Client Fee. You are responsible for any tax you must deduct at source when you pay for services, and for any registration and returns that apply to you.</p>
        <p><strong>4.7</strong> Refunds. If a funded Milestone is refunded to you, the Client Fee for that Milestone is refunded [in full / less non-refundable payment charges] [confirm].</p>
        <p><strong>4.8</strong> Changes. Verqo may change fees for future Contracts by giving at least [30] days' notice. A change does not affect funded Milestones or an agreed Business Plus rate during its term.</p>

        <h2 id="contracts">5. Contracts and milestones</h2>
        <p><strong>5.1</strong> You may post jobs, shortlist and hire. A Contract is formed when you and the Freelancer both accept its terms on the Platform. Job posts must be accurate and lawful and must not discriminate.</p>
        <p><strong>5.2</strong> Work on each Milestone should start only after you have funded it. You should review submitted work within the Review Window. If you do nothing within it, the Milestone is treated as approved.</p>
        <p><strong>5.3</strong> Changes to scope or price must be agreed on the Platform in writing before work on the change begins. Rejections must give reasons that relate to the agreed scope or acceptance criteria.</p>
        <p><strong>5.4</strong> For hourly work, you approve timesheets within the Review Window and fund the next period's hours in advance up to an agreed cap.</p>

        <h2 id="escrow">6. Escrow and payment</h2>
        <p><strong>6.1</strong> Funding. You fund each Milestone by paying the Contract Value plus the Client Fee into the Escrow Account by UPI, net banking, card or bank transfer. A Milestone shows as Funded when the Payment Partner confirms receipt. Funds for work that has started but was not funded are not protected by escrow.</p>
        <p><strong>6.2</strong> Holding. Funds are held by the Payment Partner, an RBI-authorised payment aggregator, in an escrow account with a scheduled commercial bank. They are not a deposit with Verqo, are not held in Verqo's own accounts, and earn no interest. You accept the Payment Partner's applicable terms and its verification requirements.</p>
        <p><strong>6.3</strong> Release. Funds are released when you approve a Milestone, or automatically at the end of the Review Window if you have not approved, requested changes or raised a dispute. On release, the Freelancer's net amount is paid to the Freelancer and the Platform Fees are paid to Verqo.</p>
        <p><strong>6.4</strong> Disputes. You may raise a dispute within the Review Window. The affected funds are frozen while it is resolved through the dispute process in the Terms of Use. Verqo's decision governs escrow funds only and does not stop either side from taking legal action.</p>
        <p><strong>6.5</strong> Refunds and chargebacks. If a dispute is decided in your favour, or a Contract is cancelled by agreement, funds are returned to your source account. Banks may take several working days to credit refunds. You must use the dispute process and must not start a chargeback for work under an active Contract. If you do, Verqo may contest it and may recover the amount and related costs from you.</p>
        <p><strong>6.6</strong> Holds. Verqo or the Payment Partner may delay or hold a payment where the law, a court or regulator, sanctions or anti-money-laundering rules require, or where fraud is reasonably suspected.</p>
        <p><strong>6.7</strong> Off-Platform payment. Payments for work under a Contract made on the Platform must go through escrow.</p>
        <p><strong>6.8</strong> Clients outside India. Payments are made in Indian rupees. Currency conversion, additional charges and any compliance steps for cross-border payments will be shown before you fund a Milestone [to be confirmed with the Payment Partner and counsel]. You are responsible for any taxes in your own country.</p>

        <h2 id="relationship">7. Your relationship with Freelancers</h2>
        <p><strong>7.1</strong> Freelancers are independent contractors. You must not treat them as employees. In particular, unless your Contract provides for it, you must not require fixed working hours, exclusivity, on-site attendance or use of your internal systems as an employee would, and you must not provide employee benefits or performance management.</p>
        <p><strong>7.2</strong> You must pay for work delivered under the Contract and any tax you must deduct at source, and must not ask a Freelancer to work unpaid, or for free trial work beyond what is agreed and paid.</p>
        <p><strong>7.3</strong> Non-circumvention. For [12] months after you are first introduced to a Freelancer through the Platform, Platform Fees remain payable on any paid work between you and that Freelancer for the same or related services, even if the work or payment moves off the Platform. If you wish to hire a Freelancer as an employee, you must tell Verqo first, and [no fee / a conversion fee of ₹[amount]] applies [confirm].</p>

        <h2 id="ip">8. Intellectual property and confidentiality</h2>
        <p><strong>8.1</strong> Unless your Contract says otherwise, when funds for a Milestone are released you own the intellectual property rights in the Work Product for that Milestone, as the Standard Engagement Terms provide. The Freelancer keeps pre-existing materials and grants you the licence described there.</p>
        <p><strong>8.2</strong> You confirm that you have the right to give Freelancers any materials you provide, and you will not ask for work that infringes anyone's rights.</p>
        <p><strong>8.3</strong> You and each Freelancer must keep each other's confidential information secret as the Standard Engagement Terms require. You may ask a Freelancer to sign your own non-disclosure agreement.</p>
        <p><strong>8.4</strong> Verqo's name, software, design and Platform belong to Verqo. You may use the Platform under this Agreement and may not copy, scrape or reverse engineer it.</p>

        <h2 id="acceptable-use">9. Acceptable use</h2>
        <p><strong>9.1</strong> You must follow the acceptable use rules in the Terms of Use. In particular, you must not use the Platform for unlawful work; harass or discriminate against Freelancers; ask for work that creates malware or unauthorised access; avoid Platform Fees or escrow; post fake or paid reviews; or share a Freelancer's personal data outside the purpose of the Contract.</p>
        <p><strong>9.2</strong> Verqo may remove content, restrict features or suspend accounts that break these rules.</p>

        <h2 id="data">10. Personal data</h2>
        <p><strong>10.1</strong> Verqo handles personal data on the Platform as described in its Privacy Policy and applicable law, including the Digital Personal Data Protection Act, 2023.</p>
        <p><strong>10.2</strong> You will use a Freelancer's personal data that you receive only for the Contract and for legal compliance, keep it secure, and not share it further except as the law requires.</p>
        <p><strong>10.3</strong> If you give a Freelancer personal data of your employees, customers or others, you are responsible for having a lawful basis and for giving clear instructions. The Standard Engagement Terms set out the Freelancer's duties, including breach notification.</p>
        <p><strong>10.4</strong> Each party will tell the other promptly of any personal data breach affecting data received under this Agreement.</p>

        <h2 id="availability">11. Availability and support</h2>
        <p><strong>11.1</strong> Verqo works to keep the Platform available and secure but does not promise uninterrupted service. Planned maintenance will be notified where practicable. Verqo's current availability targets are not contractual commitments.</p>
        <p><strong>11.2</strong> All Clients have access to help and support through the Platform. Business Plus Clients also receive the dedicated support set out in the Order Form, including [a named account contact and target response times of [___]].</p>

        <h2 id="termination">12. Term and termination</h2>
        <p><strong>12.1</strong> This Agreement continues until ended. Either party may end it on [30] days' notice, after active Contracts are completed or cancelled and amounts owed are settled. A Business Plus Order Form has the term stated in it.</p>
        <p><strong>12.2</strong> Verqo may suspend or end access immediately, with notice where practicable, if you breach this Agreement, fail verification, create risk of fraud or harm, or where the law requires.</p>
        <p><strong>12.3</strong> On ending, funds in escrow are dealt with under the Contracts and the dispute process, fees already earned remain payable, and provisions that by nature should continue, including those on fees, intellectual property, confidentiality, liability and disputes, continue.</p>

        <h2 id="liability">13. Warranties, liability and indemnity</h2>
        <p><strong>13.1</strong> Each party confirms that it has authority to enter this Agreement. Except as stated, the Platform is provided "as is" and "as available", and Verqo gives no warranty about the quality or legality of any work or the conduct of any user.</p>
        <p><strong>13.2</strong> To the extent the law allows, Verqo is not liable for indirect, incidental or consequential loss, or loss of profit, revenue, data or goodwill, and its total liability to you is limited to the Platform Fees you paid to Verqo in the [12] months before the claim [or ₹[amount], whichever is higher]. Nothing limits liability for fraud, wilful misconduct, or anything that cannot be limited by law, or reduces Verqo's duty to release or refund escrow funds as this Agreement describes.</p>
        <p><strong>13.3</strong> You will compensate Verqo for losses, damages and reasonable costs arising from third-party claims caused by your breach of this Agreement, your unlawful requests or content, or your failure to deduct or pay taxes you owe.</p>

        <h2 id="grievance">14. Grievances, governing law and disputes</h2>
        <p><strong>14.1</strong> Complaints may be sent to Verqo's Grievance Officer: [name], [email address]. Verqo will acknowledge within [48 hours] and aim to resolve within [one month] [confirm].</p>
        <p><strong>14.2</strong> This Agreement is governed by the laws of India. Disputes between you and Verqo will be raised first with the Grievance Officer. If not resolved within [30] days, they will be finally settled by arbitration under the Arbitration and Conciliation Act, 1996, before [a sole arbitrator / three arbitrators], with the seat and venue in Bengaluru and English as the language. Subject to that, the courts at Bengaluru have exclusive jurisdiction for interim relief and enforcement. Clients outside India: [applicable rules and enforcement to be confirmed].</p>

        <h2 id="general">15. General</h2>
        <p><strong>15.1</strong> This Agreement, with the documents it refers to, is the entire agreement between you and Verqo about the Platform.</p>
        <p><strong>15.2</strong> Verqo may change this Agreement by giving at least [30] days' notice of material changes. If you keep using the Platform after the change takes effect, you accept it. If you do not agree, you may end this Agreement under Section 12.</p>
        <p><strong>15.3</strong> If any part is unenforceable, the rest continues. A delay in enforcing a right is not a waiver. You may not assign this Agreement without Verqo's consent. Verqo may assign it to an affiliate or successor. Neither party is liable for delay caused by events beyond its reasonable control.</p>
        <p><strong>15.4</strong> Notices may be sent by email, in-app message or by posting on the Platform.</p>

        <h2 id="annex-a">Annex A: Fee schedule</h2>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Plan</th><th>Registration or subscription</th><th>Client Fee</th><th>When charged</th></tr></thead>
          <tbody>
            <tr><td>Standard Business plan</td><td>None</td><td>10% of Contract Value, added to the amount funded</td><td>At each Milestone funding</td></tr>
            <tr><td>Business Plus</td><td>None</td><td>Reduces from 10% by volume to a minimum of 5%; includes dedicated support</td><td>At each Milestone funding</td></tr>
          </tbody>
        </table>
        </div>
        <p class="table-caption">Business Plus volume tiers [to be set by Verqo]</p>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Annual Contract Value funded</th><th>Client Fee</th></tr></thead>
          <tbody>
            <tr><td>Below ₹[__]</td><td>10% (Standard Business plan)</td></tr>
            <tr><td>₹[__] to ₹[__]</td><td>[__]%</td></tr>
            <tr><td>₹[__] to ₹[__]</td><td>[__]%</td></tr>
            <tr><td>Above ₹[__]</td><td>5% (minimum)</td></tr>
          </tbody>
        </table>
        </div>
        <p class="table-caption">Worked example: Milestone with a Contract Value of ₹1,00,000</p>
        <div class="table-scroll">
        <table>
          <thead><tr><th></th><th>Standard Business plan (10%)</th><th>Business Plus at 5%</th></tr></thead>
          <tbody>
            <tr><td>Client pays into escrow</td><td>₹1,10,000</td><td>₹1,05,000</td></tr>
            <tr><td>Freelancer receives (Contract Value less 5%)</td><td>₹95,000</td><td>₹95,000</td></tr>
            <tr><td>Platform Fees received by Verqo</td><td>₹15,000</td><td>₹10,000</td></tr>
          </tbody>
        </table>
        </div>
        <p class="table-note">The figures are examples. Tax treatment of the fees is to be confirmed (Clause 4.6).</p>

        <h2 id="annex-b">Annex B: Business Plus Order Form (template)</h2>
        <div class="table-scroll">
        <table>
          <tbody>
            <tr><td>Client legal name and address</td><td>[to be completed]</td></tr>
            <tr><td>GSTIN and PAN</td><td>[to be completed]</td></tr>
            <tr><td>Authorised signatory</td><td>[name, designation]</td></tr>
            <tr><td>Effective date and term</td><td>[date]; [12] months, renewing unless ended</td></tr>
            <tr><td>Agreed Client Fee</td><td>[__]% of Contract Value (minimum 5%)</td></tr>
            <tr><td>Volume basis and review</td><td>[expected annual Contract Value]; reviewed every [12] months</td></tr>
            <tr><td>Dedicated support</td><td>[named account contact]; response targets [___]; support hours [___]</td></tr>
            <tr><td>Other agreed terms</td><td>[for example invoicing details, security requirements, approval workflow]</td></tr>
            <tr><td>Verqo signatory</td><td>[name, designation]</td></tr>
          </tbody>
        </table>
        </div>

        <h2 id="annex-c">Annex C: Standard Engagement Terms</h2>
        <p>
          These terms are the default terms of every Contract between a Client and a Freelancer made
          on the Verqo Platform — the same terms set out in the
          <a routerLink="/legal/freelancer-agreement">Freelancer Agreement</a>. The parties may agree
          different or additional terms in the Contract on the Platform; where they do not, these
          terms apply. In outline: the Contract is formed when both parties accept it on the Platform
          (default Review Window [5] working days, [2] revision rounds); scope changes must be agreed
          in writing before work starts; the Client funds each Milestone into escrow before work
          begins; each party has defined responsibilities around skill, care, deadlines and timely
          feedback; intellectual property in the Work Product assigns to the Client on release of
          funds, subject to the Freelancer's pre-existing materials; confidentiality duties continue
          for [3] years after the Contract ends; liability under a Contract is capped at amounts paid
          or payable under it in the preceding [12] months; and the Freelancer is confirmed throughout
          as an independent contractor, not an employee of the Client.
        </p>

        <h2 id="annex-d">Annex D: Client onboarding documents</h2>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Client type</th><th>Documents</th></tr></thead>
          <tbody>
            <tr><td>Company or LLP in India</td><td>Certificate of incorporation, PAN, GSTIN, authorised signatory proof and authority letter, bank account details</td></tr>
            <tr><td>Partnership or proprietorship in India</td><td>Registration or proof of existence, PAN, GSTIN where applicable, signatory proof, bank account details</td></tr>
            <tr><td>Client outside India</td><td>Registration document, tax identification number, signatory proof and authority, payment method details [to be confirmed]</td></tr>
          </tbody>
        </table>
        </div>
      </article>

      <div class="legal-footer">
        <a routerLink="/legal/terms" class="text-link">← Terms of use</a>
        <a routerLink="/signup/client" class="btn btn-client">Hire talent</a>
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
        margin-top: var(--space-2);
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
      .key-points ol {
        padding-left: var(--space-5);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
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
      .table-caption {
        margin-top: var(--space-6);
        font-weight: 700;
        color: var(--ink);
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
export class LegalClientAgreementComponent {}
