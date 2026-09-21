import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Verqo's Terms of Use — the full "Draft v0.1 for legal review" text
 * prepared for Verqo India Private Limited, reproduced here as the real
 * content for /legal/terms.
 *
 * This is not content Claude wrote from scratch: it's the actual draft
 * agreement (definitions, verification, escrow, fees, disputes, IP,
 * liability, grievance redressal, arbitration, and the fee-schedule /
 * escrow-timeline annexes) supplied for publishing. It is still explicitly
 * a pre-review draft — the bracketed placeholders (registered office
 * address, CIN, support/grievance contact details, exact day/period
 * figures) are exactly as drafted, because those facts don't exist yet and
 * shouldn't be invented. The internal "notes for legal review" table from
 * the source document is deliberately left out of this public page — it's
 * a reviewer's checklist, not terms a user should read.
 */
@Component({
  selector: 'app-legal-terms',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="legal-page container">
      <span class="status-pill status-pill--pending">Draft v0.1 — pending legal review</span>
      <h1>Terms of Use</h1>
      <p class="meta">Verqo India Private Limited · verqo.in · Effective date: [to be inserted]</p>
      <p class="intro">
        This is Verqo's draft Terms of Use, prepared for review by Indian legal counsel before it
        takes effect. It has not been reviewed by a lawyer and should not be relied on as binding
        until it has. Bracketed text marks details — like our registered office address, CIN, and
        support contacts — that genuinely don't exist yet and will be filled in before publishing.
      </p>

      <div class="key-points">
        <h4>Key points in plain language</h4>
        <p class="key-points-note">This summary is not part of the legal terms.</p>
        <ol>
          <li>Verqo is a marketplace. It connects Clients and Freelancers. It is not the employer of Freelancers and is not a party to the work contract between them.</li>
          <li>Every Freelancer is verified before joining (identity, bank account, profile, and employment status). Verqo is for professionals who are not in full-time employment, so Freelancers must not have an active PF account with a current employer.</li>
          <li>Freelancers pay no registration fee and no subscription. They pay a fixed 5% of the contract value when they receive payment.</li>
          <li>Clients pay no registration fee and no subscription. The Standard Business plan fee is 10% of contract value. Business Plus is negotiated by volume and can go as low as 5%.</li>
          <li>Client money is held in an escrow account run by a licensed payment partner and released when the work is approved, or automatically after the review window.</li>
          <li>Disputes freeze the affected milestone in escrow until they are resolved. Please keep contracts, messages and payments on Verqo.</li>
        </ol>
      </div>

      <nav class="toc">
        <h4>Contents</h4>
        <a href="#introduction">1. Introduction and acceptance</a>
        <a href="#definitions">2. Definitions</a>
        <a href="#role">3. Verqo's role</a>
        <a href="#eligibility">4. Eligibility and accounts</a>
        <a href="#verification">5. Freelancer verification and eligibility</a>
        <a href="#using">6. Using the Platform</a>
        <a href="#contracts">7. Contracts, milestones and hourly work</a>
        <a href="#fees">8. Fees and taxes</a>
        <a href="#escrow">9. Escrow and payments</a>
        <a href="#disputes">10. Disputes between Clients and Freelancers</a>
        <a href="#ip">11. Intellectual property and confidentiality</a>
        <a href="#acceptable-use">12. Acceptable use</a>
        <a href="#reviews">13. Ratings and reviews</a>
        <a href="#termination">14. Suspension and termination</a>
        <a href="#gig-registration">15. Statutory registration of gig and platform workers</a>
        <a href="#disclaimers">16. Disclaimers</a>
        <a href="#liability">17. Limitation of liability</a>
        <a href="#indemnity">18. Indemnity</a>
        <a href="#grievance">19. Grievance redressal</a>
        <a href="#law">20. Governing law and dispute resolution</a>
        <a href="#changes">21. Changes to these Terms</a>
        <a href="#general">22. General</a>
        <a href="#annex-a">Annex A: Fee schedule</a>
        <a href="#annex-b">Annex B: Escrow and payment timelines</a>
      </nav>

      <article class="legal-body">
        <h2 id="introduction">1. Introduction and acceptance</h2>
        <p><strong>1.1</strong> These Terms of Use ("Terms") govern your access to and use of the Verqo website at verqo.in and the Verqo Android and iOS applications (together, the "Platform"). The Platform is operated by Verqo India Private Limited, a company incorporated in India with its registered office at [registered office address] (CIN [to be inserted]) ("Verqo", "we", "us").</p>
        <p><strong>1.2</strong> By creating an account, or by accessing or using the Platform, you agree to these Terms and to the <a routerLink="/legal/privacy">Privacy Policy</a>. You also agree to any policies and schedules referred to in these Terms, including the Fee Schedule (Annex A) and the Escrow and Payment Timelines (Annex B).</p>
        <p><strong>1.3</strong> If you use the Platform on behalf of a company or other organisation, you confirm that you are authorised to bind it, and "you" includes that organisation.</p>
        <p><strong>1.4</strong> If you do not agree to these Terms, you must not use the Platform.</p>
        <p><strong>1.5</strong> These Terms are an electronic record under the Information Technology Act, 2000 and the rules under it. They do not require physical or digital signatures.</p>

        <h2 id="definitions">2. Definitions</h2>
        <table>
          <tbody>
            <tr><td><strong>Client</strong></td><td>A business, organisation or individual acting for a business that uses the Platform to hire Freelancers or to have projects delivered.</td></tr>
            <tr><td><strong>Freelancer</strong></td><td>An individual professional who offers technology services on the Platform and has completed verification. In the B2B channel, this includes a service provider delivering a project.</td></tr>
            <tr><td><strong>B2B channel</strong></td><td>The channel in which a product company has a project outsourced to a service provider.</td></tr>
            <tr><td><strong>B2C channel</strong></td><td>The channel in which a business directly engages Freelancers for its projects.</td></tr>
            <tr><td><strong>Contract</strong></td><td>The agreement between a Client and a Freelancer for services, made on the Platform.</td></tr>
            <tr><td><strong>Milestone</strong></td><td>A defined stage of a Contract with its own deliverable and Contract Value, funded and released separately.</td></tr>
            <tr><td><strong>Contract Value</strong></td><td>The amount agreed between the Client and the Freelancer for a Milestone or for approved hours, before Platform Fees.</td></tr>
            <tr><td><strong>Escrow Account</strong></td><td>The account operated by the Payment Partner in which Client funds are held until release or refund.</td></tr>
            <tr><td><strong>Payment Partner</strong></td><td>The Reserve Bank of India authorised payment aggregator, and its escrow bank, that Verqo uses to collect, hold and pay out funds.</td></tr>
            <tr><td><strong>Platform Fees</strong></td><td>The Freelancer Fee and the Client Fee described in Section 8.</td></tr>
            <tr><td><strong>Standard Business plan / Business Plus</strong></td><td>The two Client fee plans described in Section 8 and Annex A.</td></tr>
            <tr><td><strong>Review Window</strong></td><td>The period after a Freelancer submits a Milestone during which the Client may approve it, request changes or raise a dispute. The default is [5] working days.</td></tr>
            <tr><td><strong>Work Product</strong></td><td>The deliverables a Freelancer creates specifically for a Contract.</td></tr>
          </tbody>
        </table>

        <h2 id="role">3. Verqo's role</h2>
        <p><strong>3.1</strong> Verqo is an online marketplace and intermediary. It provides the technology that lets Clients and Freelancers find each other, form Contracts, and pay and be paid through escrow.</p>
        <p><strong>3.2</strong> A Contract is between the Client and the Freelancer. Verqo is not a party to it, and is not an employer, agent, partner or joint venturer of either. Verqo does not direct, supervise or control the work.</p>
        <p><strong>3.3</strong> Freelancers are independent contractors. They are not employees of Verqo or of any Client. They decide when, how much and for whom to work, subject to their Contracts, and there is no minimum working time or exclusivity.</p>
        <p><strong>3.4</strong> Verqo does not guarantee that any work will be available, that any Freelancer will deliver, that any Client will approve or pay other than through escrow, or that any work is lawful or fit for a purpose. Verification described in Section 5 is a screening step and is not an endorsement or a guarantee.</p>
        <p><strong>3.5</strong> Verqo is not a bank. Escrow and payment services are provided through the Payment Partner (Section 9).</p>

        <h2 id="eligibility">4. Eligibility and accounts</h2>
        <p><strong>4.1</strong> You must be at least 18 years old and capable of entering into a binding contract under Indian law.</p>
        <p><strong>4.2</strong> Freelancers must be individuals who are resident in India [confirm], hold a valid bank account in their own name, and complete verification under Section 5.</p>
        <p><strong>4.3</strong> Clients may be businesses or organisations in India or abroad, subject to applicable law, sanctions rules and successful onboarding by Verqo and the Payment Partner.</p>
        <p><strong>4.4</strong> You may hold one account. You must not share your account or let anyone else use it. You are responsible for all activity under your account and must keep your credentials secure and tell us promptly if you suspect misuse.</p>
        <p><strong>4.5</strong> You must give accurate, current and complete information, and keep it up to date.</p>
        <p><strong>4.6</strong> We may refuse to open, or may suspend or close, an account in the circumstances set out in these Terms.</p>

        <h2 id="verification">5. Freelancer verification and eligibility</h2>
        <p><strong>5.1</strong> Every Freelancer must complete the following before applying for or accepting work:</p>
        <ul>
          <li>identity verification (KYC) through a licensed verification partner, including a selfie match and duplicate-account checks;</li>
          <li>bank account and UPI verification, including a name match;</li>
          <li>profile and skills verification, which may include a review of work history, portfolio and credentials; and</li>
          <li>an employment status check under Clause 5.2.</li>
        </ul>
        <p><strong>5.2</strong> Verqo is intended for professionals who are not in full-time employment. To register, you must not have an active Provident Fund (PF) account with a current employer, and you declare that you are not in full-time employment. You also agree not to take work on the Platform while you are in full-time employment. An old PF account or a Universal Account Number that is not being contributed to by a current employer does not by itself make you ineligible.</p>
        <p><strong>5.3</strong> We carry out the employment status check only with your consent and through a licensed partner. We keep the result and the date of the check, and not your PF contribution records. Please read the <a routerLink="/legal/privacy">Privacy Policy</a> for details.</p>
        <p><strong>5.4</strong> We may repeat any check periodically and when there is a reason to do so, such as a change in your bank details or suspicious activity. You must tell us within [7] days if you take up full-time employment.</p>
        <p><strong>5.5</strong> If a check shows that you are ineligible or the result is unclear, a member of our team will review it before we decide, and you may give us more information or ask for a review by writing to [support email address]. We will respond within [5] working days.</p>
        <p><strong>5.6</strong> We may decline or remove an account where information is false or an eligibility requirement is not met. We do not charge Freelancers a registration or verification fee.</p>
        <p><strong>5.7</strong> If you misrepresent your identity, skills or employment status, we may suspend or close your account. Amounts already held in escrow for you will be dealt with under Sections 9 and 10, and we may hold amounts while we investigate.</p>

        <h2 id="using">6. Using the Platform</h2>
        <p class="subhead-label">Clients</p>
        <p><strong>6.1</strong> Job posts must be accurate, lawful and non-discriminatory, and must describe the work and budget honestly. You must not ask for free work, and you must not use the Platform to hire someone for work you intend not to pay for.</p>
        <p><strong>6.2</strong> You must provide the information and materials needed for the work and review submitted work within the Review Window.</p>
        <p class="subhead-label">Freelancers</p>
        <p><strong>6.3</strong> Proposals must be honest. You must have the skills, rights and capacity to deliver what you offer.</p>
        <p><strong>6.4</strong> You must deliver with reasonable skill and care, meet agreed deadlines, follow the Client's reasonable instructions and comply with applicable law.</p>
        <p><strong>6.5</strong> You must not subcontract work to anyone else without the Client's written consent. In the B2B channel, the service provider named in the Contract is responsible for any team members it uses.</p>
        <p><strong>6.6</strong> You may use AI tools to help with your work unless your Contract says otherwise. You must not enter a Client's confidential information into any tool that keeps it or uses it to train models without the Client's permission, and you remain responsible for the quality, accuracy and legality of the work you deliver.</p>
        <p class="subhead-label">Everyone</p>
        <p><strong>6.7</strong> Please keep communication, Contracts and payments on the Platform. This protects both sides through escrow, records and the dispute process.</p>

        <h2 id="contracts">7. Contracts, milestones and hourly work</h2>
        <p><strong>7.1</strong> A Contract is formed when the Client and the Freelancer both accept its terms on the Platform. The terms should set out the scope, deliverables, Milestones, Contract Value, deadlines, Review Window and the number of revision rounds.</p>
        <p><strong>7.2</strong> If the Contract does not say otherwise, these Terms apply as its default terms, the Review Window is [5] working days, and each Milestone includes up to [2] rounds of revisions.</p>
        <p><strong>7.3</strong> Each Milestone is funded and released separately.</p>
        <p><strong>7.4</strong> For hourly work, the Freelancer submits timesheets, the Client approves them, and the Client funds the next period's hours in advance up to an agreed cap.</p>
        <p><strong>7.5</strong> Changes to scope or price must be agreed on the Platform in writing before work on the change starts.</p>
        <p><strong>7.6</strong> A Milestone that has not been funded may be cancelled by either party. A funded Milestone may be cancelled only by agreement of both parties or through the dispute process in Section 10.</p>

        <h2 id="fees">8. Fees and taxes</h2>
        <p><strong>8.1</strong> There is no registration fee and no subscription fee for Freelancers or Clients.</p>
        <p><strong>8.2</strong> Freelancer Fee. Each Freelancer pays a fixed fee of <span class="badge badge-freelancer">5%</span> of the Contract Value of each Milestone or approved hourly amount. It is deducted from the Freelancer's payment when funds are released from escrow. The 5% does not change with a Client's plan or with volume.</p>
        <p><strong>8.3</strong> Client Fee. Standard Business plan: <span class="badge badge-client">10%</span> of the Contract Value, added to the amount the Client funds. Business Plus: a rate agreed in writing with Verqo based on the Client's contract volume, reducing from 10% to a minimum of 5% of the Contract Value, together with dedicated support. Verqo sets the volume thresholds [to be published].</p>
        <p><strong>8.4</strong> The Client Fee and the amount the Freelancer will receive are shown before the Client funds a Milestone. Verqo does not charge other undisclosed fees.</p>
        <p><strong>8.5</strong> Taxes. Platform Fees are [inclusive / exclusive] of GST [confirm]. Verqo will issue tax invoices for its fees. Freelancers are responsible for their own income tax and for GST where they are registered. Clients are responsible for any tax deduction at source that applies to their payments. Verqo may collect or deduct taxes where the law requires.</p>
        <p><strong>8.6</strong> Verqo bears the payment gateway and payout charges from its own fees [confirm]. If a funded Milestone is refunded to the Client, the Client Fee for that Milestone is refunded [in full / less non-refundable payment charges] [confirm].</p>
        <p><strong>8.7</strong> We may change Platform Fees for future Contracts by giving at least [30] days' notice. A change does not affect Milestones that are already funded.</p>
        <p><strong>8.8</strong> Non-circumvention. For [12] months after a Client and a Freelancer are first introduced through the Platform, Platform Fees remain payable on any paid work between them for the same or related services, even if they move payment off the Platform. You must not avoid Platform Fees by taking the relationship or payments off the Platform.</p>

        <h2 id="escrow">9. Escrow and payments</h2>
        <p><strong>9.1</strong> Payment Partner. Escrow and payments are provided through a Reserve Bank of India authorised payment aggregator, with an escrow account at a scheduled commercial bank. By using escrow you accept the Payment Partner's applicable terms and its verification requirements. We will name the Payment Partner in the Platform.</p>
        <p><strong>9.2</strong> No deposit, no interest. Funds in escrow are held for the purpose of the Contract. They are not a deposit with Verqo, do not earn interest, and are not held in Verqo's own bank accounts.</p>
        <p><strong>9.3</strong> Funding. The Client funds a Milestone by paying the Contract Value plus the Client Fee by UPI, net banking, card or bank transfer. The Milestone shows as "Funded" when the Payment Partner confirms receipt. Freelancers should start work on a Milestone only after it shows as Funded.</p>
        <p><strong>9.4</strong> Release. Funds are released when the Client approves the Milestone, or automatically at the end of the Review Window if the Client has neither approved nor requested changes nor raised a dispute. On release, Verqo instructs the Payment Partner to pay the Freelancer the Contract Value less the Freelancer Fee, and to pay the Platform Fees to Verqo's fee account.</p>
        <p><strong>9.5</strong> Payouts. We pay Freelancers to their verified bank account or UPI ID by NEFT, IMPS or UPI. We choose the payment method by amount, availability and cost, and we may retry through another method if a payment fails. Payouts are usually credited the same day, but timing depends on banks and payment networks, and we are not responsible for delays outside our control.</p>
        <p><strong>9.6</strong> Bank details. The bank account or UPI ID must be in the Freelancer's own name. Changing bank details requires re-verification and a cooling-off period of [48] hours before payouts resume. A payout that is returned by a bank goes back to escrow, and we will contact the Freelancer to correct the details.</p>
        <p><strong>9.7</strong> Refunds and chargebacks. If a dispute is decided for the Client, or a Contract is cancelled by agreement, funds are returned to the Client's source account. Banks may take several working days to credit refunds. A Client must use the dispute process in Section 10 and must not start a chargeback for work under an active Contract. If a chargeback is made, Verqo may contest it and may recover the amount and related costs from the Client.</p>
        <p><strong>9.8</strong> Holds. Verqo or the Payment Partner may delay or hold a payment where required by law, a court or regulator order, sanctions or anti-money-laundering rules, or where we reasonably suspect fraud. We will tell you unless we are prohibited from doing so.</p>
        <p><strong>9.9</strong> Currency. Payments are made in Indian rupees. Where a Client is outside India, the currency, exchange rate and additional charges will be shown before the Client funds a Milestone [to be confirmed with the Payment Partner].</p>
        <p><strong>9.10</strong> Off-Platform payment. Payments for work under a Contract made on the Platform must go through escrow. Paying or asking to be paid outside the Platform for such work is a breach of these Terms.</p>

        <h2 id="disputes">10. Disputes between Clients and Freelancers</h2>
        <p><strong>10.1</strong> Either party may raise a dispute about a funded Milestone before funds are released. The Client may do so at any time within the Review Window.</p>
        <p><strong>10.2</strong> When a dispute is raised, the affected funds are frozen in escrow. Both parties may submit evidence within [5] working days. Verqo will encourage the parties to reach an agreement. If they do not, Verqo will decide the dispute within [10] working days of the evidence deadline, based on the Contract and the evidence.</p>
        <p><strong>10.3</strong> Verqo may decide to release the funds in full, release part and refund part, refund in full, or require a revision.</p>
        <p><strong>10.4</strong> Verqo's decision governs only the release of funds held in escrow. It does not stop either party from taking legal action or from going to arbitration. Verqo will follow any valid order of a court, tribunal or arbitrator.</p>
        <p><strong>10.5</strong> Each party must act in good faith. Raising false or bad-faith disputes may lead to suspension.</p>

        <h2 id="ip">11. Intellectual property and confidentiality</h2>
        <p><strong>11.1</strong> Work Product. Unless the Contract says otherwise, when the funds for a Milestone are released, the Freelancer assigns to the Client all intellectual property rights in the Work Product for that Milestone.</p>
        <p><strong>11.2</strong> Pre-existing materials. Each party keeps ownership of materials it owned before the Contract. The Freelancer grants the Client a perpetual, non-exclusive, worldwide licence to use any pre-existing materials the Freelancer includes in the Work Product, as part of that Work Product.</p>
        <p><strong>11.3</strong> The Freelancer confirms that the Work Product is original or properly licensed, does not infringe anyone's rights, and that any open-source components are disclosed to the Client. The Client confirms that it has the right to give the Freelancer any materials it provides.</p>
        <p><strong>11.4</strong> Confidentiality. Each party must keep the other's confidential information secret, use it only for the Contract, and return or delete it when asked. The parties may sign a separate non-disclosure agreement.</p>
        <p><strong>11.5</strong> The Platform, its software, design and the Verqo name and logo belong to Verqo. We grant you a limited, revocable, non-transferable licence to use the Platform under these Terms.</p>
        <p><strong>11.6</strong> You keep ownership of the content you post. You grant Verqo a non-exclusive, worldwide licence to host, display and use it to operate and promote the Platform. We will not use your portfolio work for marketing without your permission.</p>

        <h2 id="acceptable-use">12. Acceptable use</h2>
        <p><strong>12.1</strong> You must not use the Platform to:</p>
        <ul>
          <li>do or offer work that is illegal, or that needs a licence you do not hold;</li>
          <li>create malware, spyware, phishing tools or tools for unauthorised access to systems, or carry out fraud;</li>
          <li>create a false identity or account, hold more than one account, or misstate your skills, experience or employment status;</li>
          <li>harass, threaten or discriminate against anyone;</li>
          <li>avoid Platform Fees or escrow, or ask for payments outside the Platform;</li>
          <li>copy, scrape or extract data from the Platform by automated means, or interfere with its security or operation;</li>
          <li>post fake, paid or misleading reviews, or manipulate ratings; or</li>
          <li>upload someone else's personal data or confidential material without the right to do so.</li>
        </ul>
        <p><strong>12.2</strong> We may remove content, restrict features or suspend accounts that break these rules.</p>

        <h2 id="reviews">13. Ratings and reviews</h2>
        <p><strong>13.1</strong> Reviews must be honest and based on real experience of the Contract. You must not offer or accept anything in return for a review. We may remove reviews that break these Terms.</p>

        <h2 id="termination">14. Suspension and termination</h2>
        <p><strong>14.1</strong> You may close your account at any time once your active Contracts are completed or cancelled and any amounts owed are settled.</p>
        <p><strong>14.2</strong> We may suspend or close an account, with notice where practicable, if you breach these Terms, fail an eligibility requirement, create risk of fraud or harm, or where the law requires. You may ask for a review of our decision by writing to [support email address].</p>
        <p><strong>14.3</strong> When an account ends, funds in escrow are dealt with under the Contract, Section 9 and Section 10, and amounts already earned remain payable subject to the law. Sections that by their nature should continue, including those on fees, intellectual property, confidentiality, liability and disputes, will continue.</p>

        <h2 id="gig-registration">15. Statutory registration of gig and platform workers</h2>
        <p><strong>15.1</strong> Indian labour and social security laws, including the Code on Social Security, 2020 and rules and state laws under it, may require platforms like Verqo to register gig and platform workers on a government portal and to report engagement details. If such a requirement applies, you consent to us registering you and sharing the information the law requires.</p>
        <p><strong>15.2</strong> Any contribution Verqo must make under such law is Verqo's responsibility. It does not change your status as an independent contractor, and it will not be deducted from your earnings unless the law requires.</p>

        <h2 id="disclaimers">16. Disclaimers</h2>
        <p><strong>16.1</strong> The Platform is provided "as is" and "as available". We work to keep it reliable and secure, but we do not promise that it will be uninterrupted or error-free.</p>
        <p><strong>16.2</strong> To the extent the law allows, we do not give any warranty about the Platform, the quality or legality of any work, or the conduct of any user, and we are not responsible for what Clients and Freelancers do or fail to do.</p>

        <h2 id="liability">17. Limitation of liability</h2>
        <p><strong>17.1</strong> To the extent the law allows, Verqo is not liable for indirect, incidental, special or consequential loss, or for loss of profit, revenue, data or goodwill.</p>
        <p><strong>17.2</strong> To the extent the law allows, Verqo's total liability to you for all claims relating to the Platform is limited to the Platform Fees you paid to Verqo in the [12] months before the claim arose [or ₹[amount], whichever is higher].</p>
        <p><strong>17.3</strong> Nothing in these Terms limits liability for fraud, wilful misconduct or any liability that cannot be limited by law, and nothing reduces Verqo's obligation to release or refund escrow funds as these Terms describe.</p>

        <h2 id="indemnity">18. Indemnity</h2>
        <p><strong>18.1</strong> You will compensate Verqo, its directors, employees and partners for losses, damages and reasonable costs arising from claims by third parties caused by your breach of these Terms, your unlawful content or work, or your infringement of anyone's rights.</p>

        <h2 id="grievance">19. Grievance redressal</h2>
        <p><strong>19.1</strong> If you have a complaint about the Platform or about content on it, please contact our Grievance Officer: [name], [designation], email [grievance email address], address [address], phone [number], available [days and hours].</p>
        <p><strong>19.2</strong> We will acknowledge complaints within [48 hours] and aim to resolve them within [one month] [confirm against applicable e-commerce and IT rules]. Complaints about personal data are handled as described in the <a routerLink="/legal/privacy">Privacy Policy</a>.</p>

        <h2 id="law">20. Governing law and dispute resolution</h2>
        <p><strong>20.1</strong> These Terms are governed by the laws of India.</p>
        <p><strong>20.2</strong> If you have a dispute with Verqo, please first write to the Grievance Officer. If it is not resolved within [30] days, it will be finally settled by arbitration under the Arbitration and Conciliation Act, 1996, by a sole arbitrator [appointed by mutual agreement]. The seat and venue will be Bengaluru, and the language will be English.</p>
        <p><strong>20.3</strong> Subject to the arbitration clause, the courts at Bengaluru have exclusive jurisdiction for interim relief and enforcement. Nothing here removes rights you have under mandatory law.</p>

        <h2 id="changes">21. Changes to these Terms</h2>
        <p><strong>21.1</strong> We may update these Terms. For material changes we will give at least [30] days' notice by email or in the Platform. If you continue to use the Platform after the change takes effect, you accept the updated Terms. If you do not agree, you may close your account.</p>

        <h2 id="general">22. General</h2>
        <p><strong>22.1</strong> These Terms, with the <a routerLink="/legal/privacy">Privacy Policy</a> and any Contract-specific terms — including the <a routerLink="/legal/freelancer-agreement">Freelancer Agreement</a> and <a routerLink="/legal/client-agreement">Client Agreement</a> — are the entire agreement between you and Verqo about the Platform.</p>
        <p><strong>22.2</strong> If any part of these Terms is unenforceable, the rest continues to apply. A delay in enforcing a right is not a waiver of it.</p>
        <p><strong>22.3</strong> You may not assign your rights under these Terms. Verqo may assign them to an affiliate or a successor to its business.</p>
        <p><strong>22.4</strong> Neither party is liable for delay or failure caused by events beyond its reasonable control.</p>
        <p><strong>22.5</strong> We may send notices to you by email, by in-app message or by posting on the Platform. You may contact us at [support email address] or at the address in Clause 1.1.</p>

        <h2 id="annex-a">Annex A: Fee schedule</h2>
        <table>
          <thead>
            <tr><th>Party / plan</th><th>Registration or subscription</th><th>Fee</th><th>When charged</th></tr>
          </thead>
          <tbody>
            <tr><td>Freelancer</td><td>None</td><td>Fixed 5% of Contract Value</td><td>Deducted at release of funds from escrow</td></tr>
            <tr><td>Client: Standard Business plan</td><td>None</td><td>10% of Contract Value, added to the amount funded</td><td>At each Milestone funding</td></tr>
            <tr><td>Client: Business Plus</td><td>None</td><td>Negotiated by volume, from 10% down to a minimum of 5% of Contract Value; includes dedicated support</td><td>At each Milestone funding</td></tr>
          </tbody>
        </table>
        <p class="table-caption">Worked example: Milestone with a Contract Value of ₹1,00,000</p>
        <table>
          <thead>
            <tr><th></th><th>Standard Business plan (10%)</th><th>Business Plus at 5%</th></tr>
          </thead>
          <tbody>
            <tr><td>Client pays into escrow</td><td>₹1,10,000</td><td>₹1,05,000</td></tr>
            <tr><td>Freelancer receives (Contract Value less 5%)</td><td>₹95,000</td><td>₹95,000</td></tr>
            <tr><td>Platform Fees received by Verqo</td><td>₹15,000 (₹10,000 Client Fee + ₹5,000 Freelancer Fee)</td><td>₹10,000 (₹5,000 Client Fee + ₹5,000 Freelancer Fee)</td></tr>
          </tbody>
        </table>
        <p class="table-note">Tax treatment of the fees is to be confirmed (Clause 8.5). The figures above are examples only.</p>

        <h2 id="annex-b">Annex B: Escrow and payment timelines</h2>
        <table>
          <tbody>
            <tr><td>Milestone shows as Funded</td><td>When the Payment Partner confirms receipt of the client payment</td></tr>
            <tr><td>Review Window</td><td>[5] working days from submission, unless the Contract says otherwise</td></tr>
            <tr><td>Dispute evidence</td><td>[5] working days from the dispute being raised</td></tr>
            <tr><td>Verqo decision on a dispute</td><td>Within [10] working days of the evidence deadline</td></tr>
            <tr><td>Payout instruction after release</td><td>Same working day where possible; target within [1] working day</td></tr>
            <tr><td>Payout credit to Freelancer</td><td>Usually the same day; depends on bank and payment network</td></tr>
            <tr><td>Refund to Client after decision</td><td>Instruction the same working day; credit depends on the bank, often [5 to 7] working days</td></tr>
            <tr><td>Bank detail change cooling-off</td><td>[48] hours</td></tr>
          </tbody>
        </table>
      </article>

      <div class="legal-footer">
        <a routerLink="/legal/privacy" class="text-link">Privacy policy →</a>
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
      .subhead-label {
        font-weight: 700;
        color: var(--ink);
        text-transform: uppercase;
        font-size: var(--text-label-size);
        letter-spacing: 0.04em;
        margin-top: var(--space-6);
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
      .legal-body .badge {
        font-family: var(--font-mono, monospace);
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
        white-space: nowrap;
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
export class LegalTermsComponent {}
