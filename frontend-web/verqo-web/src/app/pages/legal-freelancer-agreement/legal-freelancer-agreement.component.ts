import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Verqo's Freelancer Agreement — the full "Draft v0.1 for legal review"
 * text, including the Standard Engagement Terms (Annex C) that govern
 * every Contract by default. Referenced from the Terms of Use (Clause 1.2)
 * as the document that prevails over the Terms of Use for matters between
 * a Freelancer and Verqo.
 *
 * Real draft content supplied for publishing, not invented. Bracketed
 * placeholders are exactly as drafted. The source document's internal
 * "notes for legal review" checklist is left out of this public page.
 */
@Component({
  selector: 'app-legal-freelancer-agreement',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="legal-page container">
      <span class="status-pill status-pill--pending">Draft v0.1 — pending legal review</span>
      <p class="badge badge-freelancer">For freelancers</p>
      <h1>Freelancer Agreement</h1>
      <p class="meta">Verqo India Private Limited · verqo.in · Effective date: [to be inserted]</p>
      <p class="intro">
        This is Verqo's draft Freelancer Agreement — the agreement you accept when you register as
        a Freelancer, on top of the <a routerLink="/legal/terms">Terms of Use</a>. It has not been
        reviewed by a lawyer and should not be relied on as binding until it has.
      </p>

      <div class="key-points">
        <h4>Key points in plain language</h4>
        <p class="key-points-note">This summary is not part of the legal terms.</p>
        <ol>
          <li>You work as an independent contractor. Verqo is not your employer and is not your client.</li>
          <li>Verqo is for professionals who are not in full-time employment. You must pass verification (identity, bank account, profile and skills, and no active PF account with a current employer) and tell us if your situation changes.</li>
          <li>There is no registration fee and no subscription. Verqo takes a fixed 5% of the contract value when you are paid.</li>
          <li>Clients pay into escrow before you start. Funds are released when the client approves, or automatically after the review window. Disputes freeze the funds until they are resolved.</li>
          <li>You are paid to your own verified bank account or UPI ID by NEFT, IMPS or UPI. You handle your own income tax and, where it applies, GST.</li>
          <li>The client owns the work once the money is released. Please keep your work, communication and payments on Verqo.</li>
        </ol>
      </div>

      <nav class="toc">
        <h4>Contents</h4>
        <a href="#parties">1. Parties and structure</a>
        <a href="#relationship">2. Your relationship with Verqo</a>
        <a href="#eligibility">3. Eligibility and verification</a>
        <a href="#work">4. Doing the work</a>
        <a href="#fees">5. Fees, payment and tax</a>
        <a href="#escrow">6. Escrow</a>
        <a href="#ip">7. Intellectual property, confidentiality and data</a>
        <a href="#conduct">8. Conduct, non-circumvention and platform rules</a>
        <a href="#liability">9. Liability and indemnity</a>
        <a href="#gig-registration">10. Gig and platform worker registration</a>
        <a href="#termination">11. Term and termination</a>
        <a href="#grievance">12. Grievances, governing law and disputes</a>
        <a href="#general">13. General</a>
        <a href="#annex-a">Annex A: Fee and payout summary</a>
        <a href="#annex-c">Annex C: Standard Engagement Terms</a>
      </nav>

      <article class="legal-body">
        <h2 id="parties">1. Parties and structure</h2>
        <p><strong>1.1</strong> This Freelancer Agreement ("Agreement") is between Verqo India Private Limited, a company incorporated in India with its registered office at [registered office address] (CIN [to be inserted]) ("Verqo"), and the individual who accepts it electronically when registering on the Platform ("you" or the "Freelancer").</p>
        <p><strong>1.2</strong> This Agreement is made up of these terms, the Verqo <a routerLink="/legal/terms">Terms of Use</a> and <a routerLink="/legal/privacy">Privacy Policy</a>, and the Standard Engagement Terms in Annex C. If they conflict, this Agreement prevails over the Terms of Use for matters between you and Verqo. The Standard Engagement Terms apply between you and each Client unless your Contract says otherwise.</p>
        <p><strong>1.3</strong> Words in capital letters, such as Client, Contract, Milestone, Contract Value, Escrow Account, Payment Partner, Platform Fees and Review Window, have the meanings given in the Terms of Use.</p>
        <p><strong>1.4</strong> You accept this Agreement by ticking the acceptance box during registration. This is an electronic record under the Information Technology Act, 2000 and needs no signature.</p>

        <h2 id="relationship">2. Your relationship with Verqo</h2>
        <p><strong>2.1</strong> Independent contractor. You are an independent contractor. Nothing in this Agreement makes you an employee, agent, partner or joint venturer of Verqo or of any Client, and you have no authority to bind Verqo.</p>
        <p><strong>2.2</strong> Freedom to work. You decide whether to apply for or accept any work, when and how much you work, and how you do it, subject to your Contracts. Verqo does not require exclusivity or a minimum amount of work and does not supervise your work.</p>
        <p><strong>2.3</strong> Your own resources. You supply your own equipment, software, workspace and insurance, and you pay your own costs.</p>
        <p><strong>2.4</strong> No benefits. You are not entitled to salary, leave, provident fund, gratuity or other employee benefits from Verqo or Clients. This does not affect any right you have under labour or social security laws that apply to gig and platform workers (Section 10).</p>

        <h2 id="eligibility">3. Eligibility and verification</h2>
        <p><strong>3.1</strong> Registration is open to individuals who are at least 18, are resident in India [confirm], have a valid bank account in their own name, and complete verification.</p>
        <p><strong>3.2</strong> Verification. Before you can apply for or accept work, you must complete:</p>
        <ul>
          <li>identity verification (KYC) through a licensed partner, including a selfie match and duplicate-account checks;</li>
          <li>bank account and UPI verification, including a name match;</li>
          <li>profile and skills verification; and</li>
          <li>an employment status check.</li>
        </ul>
        <p><strong>3.3</strong> Employment status. Verqo is for professionals who are not in full-time employment. You confirm that you are not in full-time employment, that you do not have an active Provident Fund account with a current employer, and that you will not take work on the Platform while you are in full-time employment. An old PF account or a Universal Account Number that has no current employer contributions does not by itself make you ineligible.</p>
        <p><strong>3.4</strong> Consent. You consent to Verqo and its licensed partners carrying out these checks. Verqo keeps only the result and date of the employment check, as the Privacy Policy explains. You may withdraw consent, but Verqo may then be unable to keep your account active.</p>
        <p><strong>3.5</strong> Ongoing duties. You must give accurate information, keep it up to date, and tell Verqo within [7] days if you start full-time employment or if anything you declared changes. Verqo may repeat any check from time to time and when your bank details or key profile information change.</p>
        <p><strong>3.6</strong> Review. If a check shows you as ineligible or the result is unclear, a member of Verqo's team will review it before any decision, and you may give more information or ask for a review at [support email address]. Verqo will respond within [5] working days.</p>
        <p><strong>3.7</strong> Cost. Verqo does not charge you a registration or verification fee.</p>
        <p><strong>3.8</strong> Your confirmations. You confirm that you have the skills, qualifications and right to work that you state, and that nothing you have agreed with an employer or anyone else stops you from doing the work you take on through Verqo.</p>

        <h2 id="work">4. Doing the work</h2>
        <p><strong>4.1</strong> Work you accept on the Platform is governed by the Contract between you and the Client, including the Standard Engagement Terms.</p>
        <p><strong>4.2</strong> You must start work on a Milestone only after it shows as Funded, deliver with reasonable skill and care, meet agreed deadlines, and follow the Client's reasonable instructions.</p>
        <p><strong>4.3</strong> You must not subcontract work without the Client's written consent. In the B2B channel, if you deliver through a team, you are responsible for its members, for their verification where Verqo requires it, and for their compliance with this Agreement.</p>
        <p><strong>4.4</strong> You may use AI tools unless your Contract says otherwise. You must not enter a Client's confidential information into a tool that keeps it or uses it to train models without the Client's permission, and you remain responsible for the quality and legality of what you deliver.</p>
        <p><strong>4.5</strong> You must tell the Client and Verqo promptly of any conflict of interest and comply with applicable law, including anti-bribery and sanctions rules.</p>

        <h2 id="fees">5. Fees, payment and tax</h2>
        <p><strong>5.1</strong> No registration fee, no subscription. You pay Verqo no registration fee and no subscription fee.</p>
        <p><strong>5.2</strong> Freelancer Fee. Verqo takes a fixed fee of <span class="badge badge-freelancer">5%</span> of the Contract Value of each Milestone or approved hourly amount. It is deducted from your payment when funds are released from escrow. The 5% is the same for every Freelancer and does not change with a Client's plan, your earnings or your volume. Annex A gives an example.</p>
        <p><strong>5.3</strong> Payment. After deducting the Freelancer Fee, Verqo pays the balance to your verified bank account or UPI ID by NEFT, IMPS or UPI. Verqo chooses the method by amount, availability and cost, and may retry through another method if a payment fails. Payouts are usually credited the same day, but timing depends on banks and payment networks.</p>
        <p><strong>5.4</strong> Your bank details. The account must be in your own name. Changing bank details requires re-verification and a cooling-off period of [48] hours before payouts resume. If a payout is returned, the funds go back to escrow and Verqo will contact you to correct the details.</p>
        <p><strong>5.5</strong> Taxes. You are responsible for your own income tax and for GST where you are required to register. Verqo and Clients may deduct tax at source where the law requires, and Verqo will provide the information you need to claim credit. Verqo will issue tax invoices for its fees. Invoices for your services to Clients will be generated through the Platform [confirm structure].</p>
        <p><strong>5.6</strong> No set-off. Verqo will not set off amounts owed to you against other claims, except the Freelancer Fee, refunds ordered under the dispute process, and amounts the law requires it to deduct.</p>
        <p><strong>5.7</strong> Changes. Verqo may change the Freelancer Fee for future Contracts by giving at least [30] days' notice. A change does not affect Milestones already funded.</p>

        <h2 id="escrow">6. Escrow</h2>
        <p><strong>6.1</strong> Client money for a Milestone is held in the Escrow Account operated by the Payment Partner, an RBI-authorised payment aggregator. The money is not a deposit with Verqo and earns no interest.</p>
        <p><strong>6.2</strong> You are entitled to be paid for a Milestone when its funds are released. Funds are released when the Client approves the Milestone, or automatically at the end of the Review Window if the Client has not approved, requested changes or raised a dispute.</p>
        <p><strong>6.3</strong> If a Client does not fund a Milestone, Verqo is not obliged to pay you for work on it. Verqo will pay you all funds it has received and released for a Milestone as described in this Agreement.</p>
        <p><strong>6.4</strong> If a dispute is raised, the funds are frozen until it is resolved through the dispute process in the Terms of Use. Both sides may submit evidence, and Verqo decides within the stated time. Verqo's decision governs the release of escrow funds only and does not stop you from taking legal action.</p>
        <p><strong>6.5</strong> Verqo or the Payment Partner may delay or hold a payment where the law, a court or regulator, sanctions or anti-money-laundering rules require it, or where fraud is reasonably suspected. Verqo will tell you unless it is not allowed to.</p>
        <p><strong>6.6</strong> Refunds ordered to a Client after a dispute, cancellation or chargeback are taken from the funds held for that Milestone. If a chargeback affects a Milestone that was already paid to you, Verqo may recover the amount from later payouts only to the extent the law and the dispute process allow, and will give you notice and a chance to respond first.</p>

        <h2 id="ip">7. Intellectual property, confidentiality and data</h2>
        <p><strong>7.1</strong> Work Product. When funds for a Milestone are released, you assign to the Client the intellectual property rights in the Work Product for that Milestone, as provided in the Standard Engagement Terms. You keep your pre-existing materials and grant the Client the licence described there.</p>
        <p><strong>7.2</strong> Your profile. You keep ownership of your profile and portfolio content and give Verqo a non-exclusive, worldwide licence to host and display it to operate and promote the Platform. Verqo will not use your Client work for marketing without permission.</p>
        <p><strong>7.3</strong> Confidentiality. You must keep Clients' confidential information secret as the Standard Engagement Terms require. Verqo will keep your account and verification information confidential as the Privacy Policy describes.</p>
        <p><strong>7.4</strong> Personal data. If you handle personal data for a Client, you must follow the Client's instructions and the personal data terms in Annex C, and tell Verqo and the Client promptly [within 24 hours] of any breach. Verqo handles your personal data as set out in the <a routerLink="/legal/privacy">Privacy Policy</a>.</p>

        <h2 id="conduct">8. Conduct, non-circumvention and platform rules</h2>
        <p><strong>8.1</strong> You must follow the acceptable use rules in the Terms of Use. In particular, you must not: hold more than one account or let anyone else use yours; misstate your identity, skills or employment status; harass or discriminate against anyone; create or supply malware or tools for unauthorised access; copy or scrape the Platform; or post fake or paid reviews.</p>
        <p><strong>8.2</strong> Non-circumvention. For [12] months after you are first introduced to a Client through the Platform, Platform Fees remain payable on any paid work between you and that Client for the same or related services, even if you move the work or payment off the Platform. You must not ask for, offer or accept payment outside the Platform for work under a Contract made on it.</p>
        <p><strong>8.3</strong> Verqo may set reasonable quality and reliability standards, and may limit, suspend or end accounts with repeated valid disputes, missed deadlines or serious complaints, after giving you notice and a chance to respond where practicable.</p>

        <h2 id="liability">9. Liability and indemnity</h2>
        <p><strong>9.1</strong> Verqo is an intermediary. It is not responsible for a Client's conduct, for whether a Client funds a Milestone, or for the outcome of any Contract, other than its own obligations in this Agreement to hold and release funds it has received.</p>
        <p><strong>9.2</strong> To the extent the law allows, Verqo is not liable to you for indirect or consequential loss, and its total liability to you is limited to the Platform Fees it received from you in the [12] months before the claim [or ₹[amount], whichever is higher]. Nothing limits liability for fraud, wilful misconduct, or anything that cannot be limited by law, or reduces Verqo's duty to pay you funds it has released to you.</p>
        <p><strong>9.3</strong> You will compensate Verqo for losses, damages and reasonable costs arising from third-party claims caused by your breach of this Agreement, your unlawful work or content, your infringement of anyone's rights, or your failure to pay taxes you owe.</p>

        <h2 id="gig-registration">10. Gig and platform worker registration</h2>
        <p><strong>10.1</strong> Indian labour and social security laws, including the Code on Social Security, 2020 and rules and state laws under it, may require Verqo to register gig and platform workers on a government portal and report engagement details. If a requirement applies, you consent to Verqo registering you and sharing the information the law requires.</p>
        <p><strong>10.2</strong> Any contribution Verqo must make under such law is Verqo's responsibility. It does not change your status as an independent contractor and will not be deducted from your earnings unless the law requires it. You may be entitled to benefits under schemes made under those laws.</p>

        <h2 id="termination">11. Term and termination</h2>
        <p><strong>11.1</strong> This Agreement continues until ended. You may end it by closing your account after your active Contracts are completed or cancelled and amounts owed are settled. Verqo may end it on [15] days' notice.</p>
        <p><strong>11.2</strong> Verqo may suspend or end it immediately, with notice where practicable, if you fail an eligibility requirement, misrepresent yourself, breach this Agreement, create risk of fraud or harm, or where the law requires. You may ask for a review of the decision at [support email address].</p>
        <p><strong>11.3</strong> When this Agreement ends, funds in escrow for your Contracts are dealt with under the Contract and the dispute process, amounts already earned remain payable subject to the law, and provisions that by nature should continue, including those on fees, intellectual property, confidentiality, liability and disputes, continue.</p>

        <h2 id="grievance">12. Grievances, governing law and disputes</h2>
        <p><strong>12.1</strong> Complaints may be sent to Verqo's Grievance Officer: [name], [email address]. Verqo will acknowledge within [48 hours] and aim to resolve within [one month] [confirm].</p>
        <p><strong>12.2</strong> This Agreement is governed by the laws of India. Disputes between you and Verqo will be raised first with the Grievance Officer. If not resolved within [30] days, they will be finally settled by arbitration under the Arbitration and Conciliation Act, 1996, before a sole arbitrator, with the seat and venue in Bengaluru and English as the language. Subject to that, the courts at Bengaluru have exclusive jurisdiction for interim relief and enforcement. Nothing removes rights you have under mandatory law.</p>

        <h2 id="general">13. General</h2>
        <p><strong>13.1</strong> This Agreement, with the documents it refers to, is the entire agreement between you and Verqo about the Platform.</p>
        <p><strong>13.2</strong> Verqo may change this Agreement by giving at least [30] days' notice of material changes by email or in the Platform. If you keep using the Platform after the change takes effect, you accept it. If you do not agree, you may close your account.</p>
        <p><strong>13.3</strong> If any part is unenforceable, the rest continues. A delay in enforcing a right is not a waiver. You may not assign this Agreement. Verqo may assign it to an affiliate or successor. Neither party is liable for delay caused by events beyond its reasonable control.</p>
        <p><strong>13.4</strong> Notices may be sent by email, in-app message or by posting on the Platform.</p>

        <h2 id="annex-a">Annex A: Fee and payout summary</h2>
        <table>
          <tbody>
            <tr><td>Registration fee</td><td>None</td></tr>
            <tr><td>Subscription fee</td><td>None</td></tr>
            <tr><td>Freelancer Fee</td><td>Fixed 5% of Contract Value, deducted when funds are released</td></tr>
            <tr><td>Payout methods</td><td>NEFT, IMPS or UPI to your verified bank account or UPI ID</td></tr>
            <tr><td>Payout timing</td><td>Usually the same day after release; depends on banks and payment networks</td></tr>
            <tr><td>Bank detail change</td><td>Re-verification and a cooling-off period of [48] hours</td></tr>
          </tbody>
        </table>
        <p class="table-caption">Worked example: Milestone with a Contract Value of ₹1,00,000</p>
        <table>
          <tbody>
            <tr><td>Contract Value agreed with the Client</td><td>₹1,00,000</td></tr>
            <tr><td>Less Freelancer Fee (5%)</td><td>₹5,000</td></tr>
            <tr><td>Paid to you</td><td>₹95,000</td></tr>
          </tbody>
        </table>
        <p class="table-note">The Client pays a separate Client Fee, which does not reduce your payment. Tax treatment is described in Clause 5.5.</p>

        <h2 id="annex-c">Annex C: Standard Engagement Terms</h2>
        <p>
          These terms are the default terms of every Contract between a Client and a Freelancer made
          on the Verqo Platform. The parties may agree different or additional terms in the Contract
          on the Platform. Where they do not, these terms apply. Words in capital letters have the
          meanings given in the Verqo Terms of Use.
        </p>
        <p><strong>1. The Contract.</strong> A Contract is formed when the Client and the Freelancer both accept its terms on the Platform. It is made directly between them. Verqo is not a party to it and provides escrow and payment services. Each Contract sets out the scope, deliverables, Milestones, Contract Value, deadlines and any acceptance criteria. If the Contract does not say otherwise, the Review Window is [5] working days and each Milestone includes up to [2] rounds of revisions.</p>
        <p><strong>2. Scope, changes and acceptance.</strong> The Freelancer will deliver the services and deliverables described in the Contract. Changes to scope, deadlines or price must be agreed on the Platform in writing before work on the change begins. When the Freelancer submits a Milestone, the Client has the Review Window to approve it, ask for changes that fall within the agreed scope, or raise a dispute; otherwise the Milestone is treated as approved and funds are released. A Client may reject a Milestone only where it does not meet the agreed scope or acceptance criteria, and must say why so the Freelancer can put it right.</p>
        <p><strong>3. Payment.</strong> The Client funds each Milestone into escrow before work on it starts. The Freelancer need not begin work on a Milestone that is not shown as Funded. For hourly work, the Freelancer submits timesheets, the Client approves them within the Review Window, and the Client funds the next period's hours in advance up to the agreed cap. Platform Fees are dealt with in the Terms of Use and the Freelancer/Client Agreements and are not a matter between the Client and the Freelancer. Expenses are payable only where agreed in the Contract in advance, and the Client approves them.</p>
        <p><strong>4. Responsibilities.</strong> The Freelancer will deliver with reasonable skill and care, meet agreed deadlines, follow the Client's reasonable instructions, use suitably qualified people, and comply with applicable law and the Client's reasonable security and conduct rules. The Client will give the information, access and feedback the Freelancer reasonably needs, on time, and will pay for work delivered under the Contract. The Freelancer may use AI tools unless the Contract says otherwise, but must not enter the Client's confidential information into any tool that keeps it or uses it to train models without the Client's permission.</p>
        <p><strong>5. Intellectual property.</strong> When the funds for a Milestone are released, the Freelancer assigns to the Client all intellectual property rights in the Work Product for that Milestone, unless the Contract says otherwise. Each party keeps materials it owned before the Contract, and the Freelancer grants the Client a perpetual, non-exclusive, worldwide licence to use pre-existing materials included in the Work Product, as part of that Work Product. The Freelancer confirms the Work Product is original or properly licensed, does not knowingly infringe anyone's rights, and will disclose open-source components; the Client confirms it has the right to give the Freelancer the materials it provides. The Freelancer may show non-confidential parts of the Work Product in a portfolio only with the Client's permission.</p>
        <p><strong>6. Confidentiality.</strong> Each party will keep the other's confidential information secret, use it only for the Contract, and return or delete it when asked, unless the law requires it to be kept. This does not apply to information that is public without breach, was already lawfully known, or must be disclosed by law. These duties continue for [3] years after the Contract ends, and for trade secrets for as long as they remain secret.</p>
        <p><strong>7. Personal data.</strong> If the Freelancer handles personal data of the Client's employees, customers or others, the Freelancer will use it only as the Client instructs for the Contract, keep it secure, not copy or keep it after the Contract, and tell the Client promptly [within 24 hours] of any breach. The Client is responsible for having a lawful basis to share that data.</p>
        <p><strong>8. Warranties and liability.</strong> The Freelancer warrants that the Work Product will substantially meet the agreed scope, and that it will not knowingly include malware or code intended to harm the Client's systems. The Freelancer will fix defects reported within [30] days of approval at no extra charge. To the extent the law allows, each party's total liability to the other under a Contract is limited to the amounts paid or payable under that Contract in the [12] months before the claim, and neither party is liable for indirect or consequential loss. This does not limit liability for fraud, wilful misconduct, breach of confidentiality, infringement of intellectual property, or anything that cannot be limited by law.</p>
        <p><strong>9. Ending a Contract.</strong> A Contract ends when all Milestones are completed and paid. Either party may end a Contract by written notice if the other commits a material breach and does not fix it within [7] days of notice. The Client may end a Contract for convenience by notice on the Platform, and will pay for work delivered and approved and for work reasonably completed on the current Milestone. The Freelancer may end a Contract for convenience on [7] days' notice, and any funds for work not delivered will be returned to the Client. Funds held in escrow when a Contract ends are dealt with as the Terms of Use describe, including through the dispute process.</p>
        <p><strong>10. Independent contractor.</strong> The Freelancer is an independent contractor and not an employee, agent or partner of the Client. The Freelancer decides how to do the work, uses their own tools, and is responsible for their own taxes and insurance. The Client will not treat the Freelancer as an employee and will not impose fixed working hours, exclusivity or on-site attendance unless the Contract provides for it.</p>
        <p><strong>11. Disputes and law.</strong> The parties will first try to resolve any dispute through the Platform's dispute process. Any dispute between them about the Contract is governed by the laws of India, and is resolved as set out in the Terms of Use [confirm].</p>
        <p><strong>12. Order of precedence.</strong> If there is a conflict, the terms of the individual Contract prevail over these Standard Engagement Terms for that Contract, except that nothing in a Contract overrides the escrow, fee and dispute rules in the Terms of Use, which govern Verqo's services.</p>
      </article>

      <div class="legal-footer">
        <a routerLink="/legal/terms" class="text-link">← Terms of use</a>
        <a routerLink="/signup/freelancer" class="btn btn-accent">Join as a freelancer</a>
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
export class LegalFreelancerAgreementComponent {}
