# Security Specification & Test Payloads for Verqo Firestore

## 1. Data Invariants

1. **User Identity Invariant**: A user document at `/users/{userId}` can only be written by the authenticated user whose `request.auth.uid == userId`. Role escalation to 'Admin' is forbidden unless verified against trusted authority.
2. **Profile Ownership Invariant**: A FreelancerProfile or ClientProfile can only be created or modified by the user whose `userId == request.auth.uid`.
3. **Job Authority Invariant**: A job at `/jobs/{jobId}` can only be created or updated by the authenticated client whose `clientId` matches their profile ID.
4. **Proposal Integrity Invariant**: A proposal at `/proposals/{proposalId}` must have `freelancerId` belonging to the authenticated freelancer. The status can only be updated to 'Accepted' or 'Declined' by the job's posting client.
5. **Contract Access Invariant**: Only the contract's designated client or freelancer can read contract documents and associated milestones.
6. **Escrow Milestone State Machine Invariant**:
   - `Unfunded` -> `Funded`: Only client can fund.
   - `Funded` -> `InProgress`: Freelancer can start work.
   - `InProgress` -> `Submitted`: Freelancer submits deliverables.
   - `Submitted` -> `ApprovedReleased`: Client approves and releases payout.
   - Any modification once `ApprovedReleased` is strictly forbidden (terminal state).
7. **Ledger Immutability Invariant**: Ledger entries at `/ledgerEntries/{entryId}` are append-only audit records. No updates or deletions are allowed under any circumstances.
8. **PII Isolation Invariant**: Sensitive identity details (such as PAN number and Aadhaar info) are strictly restricted to the profile owner and system services.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Ghost Field Injection / Shadow Update)**: An update to a job including an unauthorized ghost field `verifiedBudgetTier: "EnterpriseUnlimited"`.
2. **Payload 2 (Privilege Escalation on User Profile)**: An update payload attempting to elevate `role: "Admin"` on `/users/{userId}`.
3. **Payload 3 (Impersonated Job Creation)**: A client attempting to post a job with `clientId: "cp-other-company"`.
4. **Payload 4 (Unauthenticated Milestone Approval)**: A freelancer attempting to approve their own milestone and trigger a payout release directly.
5. **Payload 5 (Terminal State Bypass)**: An update to an already `ApprovedReleased` milestone attempting to revert state to `Funded`.
6. **Payload 6 (Oversized Payload / Denial of Wallet)**: A proposal cover note containing a 500KB string payload exceeding the `maxLength` limit.
7. **Payload 7 (Path Variable Poisoning)**: An injection payload targeting document ID `/jobs/..%2F..%2Fhack` with invalid characters.
8. **Payload 8 (Ledger Modification Attack)**: An update operation attempting to tamper with an existing `FreelancerPayout` ledger transaction.
9. **Payload 9 (Cross-User Contract Peeking)**: An unassociated client querying `/contracts/{contractId}` where they are neither the client nor the freelancer.
10. **Payload 10 (Spoofed Proposal Submission)**: A user submitting a proposal with `freelancerId: "fp-arjun-mehta"` while logged in as another user.
11. **Payload 11 (Aadhaar/PAN PII Exposure)**: An unauthenticated or 3rd-party user attempting a `get` on another freelancer's private verification document.
12. **Payload 12 (Negative Minor Unit Injection)**: A job or proposal specifying a negative budget/rate value (`proposedRateMinor: -50000000`).

---

## 3. Security Assertions & Verification Target

All 12 dirty payloads must fail with `PERMISSION_DENIED`. Rules must enforce strict schemas, field immutability, state transitions, and role validations.
