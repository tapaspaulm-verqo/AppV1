import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS & logging
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health checks
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));
app.get('/readyz', (req, res) => res.json({ status: 'ready' }));

// --- In-memory Data Stores ---
const usersStore = new Map();
const sessions = new Map();
const freelancerProfiles = new Map();
const clientProfiles = new Map();

// --- Seed Users & Profiles ---
const SEED_FREELANCER_USER_ID = 'u-freelancer-arjun';
const SEED_FREELANCER_PROFILE_ID = 'fp-arjun-mehta';
const SEED_CLIENT_USER_ID = 'u-client-nexus';
const SEED_CLIENT_PROFILE_ID = 'cp-nexus-labs';

usersStore.set(SEED_FREELANCER_USER_ID, {
  id: SEED_FREELANCER_USER_ID,
  email: 'freelancer@verqo.com',
  password: 'password123',
  role: 'Freelancer',
  displayName: 'Arjun Mehta',
  freelancerProfileId: SEED_FREELANCER_PROFILE_ID,
  clientProfileId: null,
  isFullyVerified: true,
  createdAt: '2026-09-18T00:00:00.000Z',
});

freelancerProfiles.set(SEED_FREELANCER_PROFILE_ID, {
  id: SEED_FREELANCER_PROFILE_ID,
  userId: SEED_FREELANCER_USER_ID,
  displayName: 'Arjun Mehta',
  headline: 'Senior Staff Distributed Systems Engineer',
  bio: 'Specialist in high-throughput distributed transaction engines, Raft/Paxos consensus, and rigorous idempotency semantics.',
  primaryRole: 'Backend',
  rateBand: 'Band3',
  experienceLevel: 'Staff',
  hourlyRateMinor: 250000,
  isFullyVerified: true,
  panStatus: 'Eligible',
  aadhaarStatus: 'Eligible',
  epfStatus: 'Eligible',
  panNumber: 'AAAPA1111A',
  aadhaarLast4: '2346',
  createdAt: '2026-09-18T00:00:00.000Z',
});

usersStore.set(SEED_CLIENT_USER_ID, {
  id: SEED_CLIENT_USER_ID,
  email: 'client@verqo.com',
  password: 'password123',
  role: 'Client',
  displayName: 'Nexus Labs Inc.',
  freelancerProfileId: null,
  clientProfileId: SEED_CLIENT_PROFILE_ID,
  isFullyVerified: true,
  createdAt: '2026-09-18T00:00:00.000Z',
});

clientProfiles.set(SEED_CLIENT_PROFILE_ID, {
  id: SEED_CLIENT_PROFILE_ID,
  userId: SEED_CLIENT_USER_ID,
  companyName: 'Nexus Labs Inc.',
  gstin: '27AAPFU0939F1ZV',
  plan: 'Standard',
  negotiatedFeeRate: null,
  createdAt: '2026-09-18T00:00:00.000Z',
});

// Additional verified freelancers for directory search
const additionalFreelancers = [
  {
    id: 'fp-priya-sharma',
    displayName: 'Priya Sharma',
    headline: 'Lead Full Stack Engineer (Angular 18 & .NET 9)',
    primaryRole: 'Full Stack',
    rateBand: 'Band2',
    experienceLevel: 'Staff',
    hourlyRateMinor: 180000,
    isFullyVerified: true,
    panStatus: 'Eligible',
    aadhaarStatus: 'Eligible',
    epfStatus: 'Eligible',
    createdAt: '2026-09-19T08:00:00.000Z',
  },
  {
    id: 'fp-devendra-rao',
    displayName: 'Devendra Rao',
    headline: 'Principal Kubernetes & Cloud Platform Architect',
    primaryRole: 'DevOps / SRE',
    rateBand: 'Band3',
    experienceLevel: 'Principal',
    hourlyRateMinor: 320000,
    isFullyVerified: true,
    panStatus: 'Eligible',
    aadhaarStatus: 'Eligible',
    epfStatus: 'Eligible',
    createdAt: '2026-09-19T09:00:00.000Z',
  },
  {
    id: 'fp-sneha-kulkarni',
    displayName: 'Sneha Kulkarni',
    headline: 'Security & Cryptography Specialist (KYC / Identity)',
    primaryRole: 'Security',
    rateBand: 'Band3',
    experienceLevel: 'Senior',
    hourlyRateMinor: 280000,
    isFullyVerified: true,
    panStatus: 'Eligible',
    aadhaarStatus: 'Eligible',
    epfStatus: 'Eligible',
    createdAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'fp-rohan-verma',
    displayName: 'Rohan Verma',
    headline: 'Senior Mobile Platforms Engineer (Flutter & Android)',
    primaryRole: 'Mobile',
    rateBand: 'Band2',
    experienceLevel: 'Senior',
    hourlyRateMinor: 200000,
    isFullyVerified: true,
    panStatus: 'Eligible',
    aadhaarStatus: 'Eligible',
    epfStatus: 'Eligible',
    createdAt: '2026-09-20T11:00:00.000Z',
  },
];

for (const f of additionalFreelancers) {
  freelancerProfiles.set(f.id, f);
}

// --- Jobs Store ---
const jobsStore = [
  {
    id: 'e7b8f9a0-1234-4567-89ab-cdef01234567',
    clientId: SEED_CLIENT_PROFILE_ID,
    clientName: 'Nexus Labs Inc.',
    title: 'Senior Staff Distributed Systems Engineer',
    description: `We are seeking a senior distributed systems engineer to lead the core transaction settlement engine. Must have proven experience with high-throughput event logs, Raft/Paxos consensus, and rigorous idempotency semantics.

Key responsibilities:
• Architect low-latency ledger state machine
• Implement strict idempotency guarantees and audit trails
• Collaborate with security audit teams for SOC2 / ISO compliance

Requirements:
• 8+ years building mission-critical distributed platforms
• Deep expertise in C#, Go, or Rust
• Verifiable track record with verified Verqo credentials`,
    roleCategory: 'Backend',
    channel: 'B2B',
    status: 'Open',
    budgetMinorMin: 250000000,
    budgetMinorMax: 350000000,
    createdAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: 'f8c9d0e1-2345-5678-9abc-def012345678',
    clientId: SEED_CLIENT_PROFILE_ID,
    clientName: 'Nexus Labs Inc.',
    title: 'Principal Kubernetes & Cloud Platform Architect',
    description: `Lead the cloud-native infrastructure buildout for our global escrow and payment settlement network across multi-cloud regions.

Key responsibilities:
• Design multi-cluster Kubernetes topologies on AWS and GCP
• Enforce zero-trust network policies and mutual TLS
• Build automated canary deployment pipelines and disaster recovery drills

Requirements:
• 7+ years in cloud infrastructure, Kubernetes, and Terraform
• Strong experience with high-availability financial services platforms`,
    roleCategory: 'DevOps / SRE',
    channel: 'B2B',
    status: 'Open',
    budgetMinorMin: 200000000,
    budgetMinorMax: 300000000,
    createdAt: '2026-09-19T14:30:00.000Z',
    updatedAt: '2026-09-19T14:30:00.000Z',
  },
  {
    id: 'a1b2c3d4-3456-6789-abcd-ef0123456789',
    clientId: SEED_CLIENT_PROFILE_ID,
    clientName: 'Nexus Labs Inc.',
    title: 'Lead Full Stack Engineer (Angular 18 & .NET 9)',
    description: `Verqo-verified client looking for a lead full stack engineer to expand our enterprise talent collaboration portal.

Key responsibilities:
• Build high-performance, accessible Angular interfaces
• Integrate contract lifecycle workflows and automated milestone release
• Implement real-time notifications and milestone review queues

Requirements:
• 5+ years of modern Angular and enterprise Web APIs
• Familiarity with escrow workflows and client-side form validation`,
    roleCategory: 'Full Stack',
    channel: 'B2C',
    status: 'Open',
    budgetMinorMin: 180000000,
    budgetMinorMax: 240000000,
    createdAt: '2026-09-20T08:15:00.000Z',
    updatedAt: '2026-09-20T08:15:00.000Z',
  },
  {
    id: 'b2c3d4e5-4567-789a-bcde-f0123456789a',
    clientId: SEED_CLIENT_PROFILE_ID,
    clientName: 'Nexus Labs Inc.',
    title: 'Security & Cryptography Specialist (KYC / Identity)',
    description: `Join us to build state-of-the-art offline identity validation and document protection algorithms.

Key responsibilities:
• Validate and optimize Aadhaar Verhoeff checksums and PAN integrity routines
• Architect peppered hashing systems preventing leak of sensitive identity identifiers
• Implement tamper-evident audit logs

Requirements:
• Strong mathematical foundation in error detection, hashing, and encryption
• Familiarity with UIDAI and regulatory data protection guidelines`,
    roleCategory: 'Security',
    channel: 'B2B',
    status: 'Open',
    budgetMinorMin: 220000000,
    budgetMinorMax: 320000000,
    createdAt: '2026-09-21T07:45:00.000Z',
    updatedAt: '2026-09-21T07:45:00.000Z',
  },
];

// --- Contracts, Milestones & Ledger Stores ---
const contractsStore = [
  {
    id: 'c-nexus-arjun-01',
    clientId: SEED_CLIENT_PROFILE_ID,
    clientName: 'Nexus Labs Inc.',
    counterpartyName: 'Nexus Labs Inc.',
    freelancerId: SEED_FREELANCER_PROFILE_ID,
    freelancerName: 'Arjun Mehta',
    freelancerRole: 'Backend',
    jobId: 'e7b8f9a0-1234-4567-89ab-cdef01234567',
    jobTitle: 'Senior Staff Distributed Systems Engineer',
    scopeSummary: 'Core Transaction Settlement Engine & Idempotent Ledger',
    status: 'Active',
    channel: 'B2B',
    createdAt: '2026-09-19T10:00:00.000Z',
    contractValueMinor: 30000000,
  },
];

const milestonesStore = [
  {
    id: 'm-settlement-01',
    contractId: 'c-nexus-arjun-01',
    title: 'Milestone 1: Architectural Specification & State Machine Design',
    contractValueMinor: 10000000,
    state: 'ApprovedReleased',
    reviewWindowDays: 5,
    fundedAt: '2026-09-19T11:00:00.000Z',
    submittedAt: '2026-09-20T14:00:00.000Z',
    reviewDeadlineAt: '2026-09-25T14:00:00.000Z',
    releasedAt: '2026-09-21T09:30:00.000Z',
    createdAt: '2026-09-19T10:00:00.000Z',
  },
  {
    id: 'm-settlement-02',
    contractId: 'c-nexus-arjun-01',
    title: 'Milestone 2: High-Throughput Ingestion & Idempotency Filter Implementation',
    contractValueMinor: 10000000,
    state: 'Submitted',
    reviewWindowDays: 5,
    fundedAt: '2026-09-21T10:00:00.000Z',
    submittedAt: '2026-09-21T18:00:00.000Z',
    reviewDeadlineAt: '2026-09-26T18:00:00.000Z',
    releasedAt: null,
    createdAt: '2026-09-19T10:00:00.000Z',
  },
  {
    id: 'm-settlement-03',
    contractId: 'c-nexus-arjun-01',
    title: 'Milestone 3: Fault Injection Testing & Zero-Trust Audit Verification',
    contractValueMinor: 10000000,
    state: 'Funded',
    reviewWindowDays: 5,
    fundedAt: '2026-09-21T10:00:00.000Z',
    submittedAt: null,
    reviewDeadlineAt: null,
    releasedAt: null,
    createdAt: '2026-09-19T10:00:00.000Z',
  },
  {
    id: 'm-settlement-04',
    contractId: 'c-nexus-arjun-01',
    title: 'Milestone 4: Production Rollout & Canary Deployment Validation',
    contractValueMinor: 10000000,
    state: 'Unfunded',
    reviewWindowDays: 5,
    fundedAt: null,
    submittedAt: null,
    reviewDeadlineAt: null,
    releasedAt: null,
    createdAt: '2026-09-19T10:00:00.000Z',
  },
];

const ledgerEntriesStore = [
  // M1 entries
  {
    id: 'l-fund-01',
    milestoneId: 'm-settlement-01',
    type: 'EscrowFund',
    amountMinor: 11000000, // contract ₹1L + ₹10k client fee (10%)
    createdAt: '2026-09-19T11:00:00.000Z',
  },
  {
    id: 'l-payout-01',
    milestoneId: 'm-settlement-01',
    type: 'FreelancerPayout',
    amountMinor: 9500000, // contract ₹1L - ₹5k freelancer fee (5%)
    createdAt: '2026-09-21T09:30:00.000Z',
  },
  {
    id: 'l-clientfee-01',
    milestoneId: 'm-settlement-01',
    type: 'ClientFee',
    amountMinor: 1000000,
    createdAt: '2026-09-21T09:30:00.000Z',
  },
  {
    id: 'l-freelancerfee-01',
    milestoneId: 'm-settlement-01',
    type: 'FreelancerFee',
    amountMinor: 500000,
    createdAt: '2026-09-21T09:30:00.000Z',
  },
  // M2 entries (Funded)
  {
    id: 'l-fund-02',
    milestoneId: 'm-settlement-02',
    type: 'EscrowFund',
    amountMinor: 11000000,
    createdAt: '2026-09-21T10:00:00.000Z',
  },
  // M3 entries (Funded)
  {
    id: 'l-fund-03',
    milestoneId: 'm-settlement-03',
    type: 'EscrowFund',
    amountMinor: 11000000,
    createdAt: '2026-09-21T10:00:00.000Z',
  },
];

const proposalsStore = [
  {
    id: 'p-arjun-01',
    jobId: 'e7b8f9a0-1234-4567-89ab-cdef01234567',
    freelancerId: SEED_FREELANCER_PROFILE_ID,
    coverNote: 'Extensive track record building low-latency state machines and Raft consensus engines.',
    proposedRateMinor: 250000000,
    status: 'Accepted',
    createdAt: '2026-09-18T12:00:00.000Z',
  },
];

// --- Validation Helpers ---
const PAN_FORMAT = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const VALID_PAN_HOLDERS = new Set(['P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T']);

function validatePan(pan) {
  if (!pan || typeof pan !== 'string') return 'PAN is required.';
  const normalized = pan.trim().toUpperCase();
  if (!PAN_FORMAT.test(normalized)) {
    return 'PAN must be in the format AAAAA9999A (5 letters, 4 digits, 1 letter).';
  }
  if (!VALID_PAN_HOLDERS.has(normalized[3])) {
    return `'${normalized[3]}' in position 4 is not a recognised PAN holder-type code.`;
  }
  return null;
}

const D_VERHOEFF = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const P_VERHOEFF = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

function validateAadhaar(aadhaar) {
  if (!aadhaar || typeof aadhaar !== 'string') return 'Aadhaar number is required.';
  const normalized = aadhaar.replace(/\s+/g, '').trim();
  if (!/^[2-9][0-9]{11}$/.test(normalized)) {
    return 'Aadhaar must be exactly 12 digits and cannot start with 0 or 1.';
  }
  let c = 0;
  for (let i = 0; i < normalized.length; i++) {
    const digit = Number(normalized[normalized.length - 1 - i]);
    c = D_VERHOEFF[c][P_VERHOEFF[i % 8][digit]];
  }
  if (c !== 0) {
    return 'Aadhaar number failed checksum validation — check for a typo.';
  }
  return null;
}

const GSTIN_FORMAT = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

function validateGstin(gstin) {
  if (!gstin) return null; // optional
  const normalized = gstin.trim().toUpperCase();
  if (!GSTIN_FORMAT.test(normalized)) {
    return "GSTIN must be 15 characters: a 2-digit state code, the business's 10-character PAN, an entity number, 'Z', and a check digit.";
  }
  const stateCode = Number(normalized.slice(0, 2));
  if (stateCode < 1 || stateCode > 38) {
    return 'The first two digits of a GSTIN must be a valid state code (01–38).';
  }
  if (!VALID_PAN_HOLDERS.has(normalized[5])) {
    return 'The PAN embedded in the GSTIN (characters 3–12) is not validly formatted.';
  }
  return null;
}

// Fee calculations per BusinessRules.cs
function calculateFees(contractValueMinor, clientPlan = 'Standard', negotiatedRate = null) {
  const clientFeeRate = clientPlan === 'Standard' ? 0.10 : (negotiatedRate || 0.05);
  const freelancerFeeRate = 0.05;

  const clientFeeMinor = Math.round(contractValueMinor * clientFeeRate);
  const freelancerFeeMinor = Math.round(contractValueMinor * freelancerFeeRate);

  return {
    contractValueMinor,
    clientFeeMinor,
    freelancerFeeMinor,
    clientPaysTotalMinor: contractValueMinor + clientFeeMinor,
    freelancerReceivesMinor: contractValueMinor - freelancerFeeMinor,
    verqoGrossFeeMinor: clientFeeMinor + freelancerFeeMinor,
    clientFeeRate,
    freelancerFeeRate,
  };
}

// Session resolver
function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (sessions.has(token)) {
      const sess = sessions.get(token);
      if (new Date(sess.expiresAt).getTime() > Date.now()) {
        return sess.user;
      }
    }
  }
  return null;
}

// --- API Routes ---

// POST /api/v1/auth/login
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const normEmail = email.trim().toLowerCase();
  const user = Array.from(usersStore.values()).find(u => u.email === normEmail);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = 'tok_' + crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 12 * 3600 * 1000).toISOString();

  const sessionUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    displayName: user.displayName || user.email,
    freelancerProfileId: user.freelancerProfileId || null,
    clientProfileId: user.clientProfileId || null,
    isFullyVerified: user.isFullyVerified ?? true,
  };

  sessions.set(token, { token, expiresAt, user: sessionUser });

  res.json({
    token,
    expiresAt,
    user: sessionUser,
  });
});

// GET /api/v1/auth/me
app.get('/api/v1/auth/me', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json(user);
});

// GET /api/v1/jobs
app.get('/api/v1/jobs', (req, res) => {
  const summaries = jobsStore
    .filter(j => j.status === 'Open')
    .map(j => ({
      id: j.id,
      title: j.title,
      roleCategory: j.roleCategory,
      budgetMinorMin: j.budgetMinorMin,
      budgetMinorMax: j.budgetMinorMax,
      channel: j.channel,
      createdAt: j.createdAt,
    }));
  res.json(summaries);
});

// GET /api/v1/jobs/search
app.get('/api/v1/jobs/search', (req, res) => {
  const { role, q } = req.query || {};
  let list = jobsStore.filter(j => j.status === 'Open');

  if (q) {
    const term = String(q).trim().toLowerCase();
    list = list.filter(j =>
      j.title.toLowerCase().includes(term) ||
      j.description.toLowerCase().includes(term) ||
      j.roleCategory.toLowerCase().includes(term)
    );
  }

  if (role) {
    list.sort((a, b) => {
      if (a.roleCategory === role && b.roleCategory !== role) return -1;
      if (b.roleCategory === role && a.roleCategory !== role) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  const results = list.map(j => ({
    id: j.id,
    title: j.title,
    roleCategory: j.roleCategory,
    budgetMinorMin: j.budgetMinorMin,
    budgetMinorMax: j.budgetMinorMax,
    channel: j.channel,
    clientName: j.clientName || 'Nexus Labs Inc.',
    proposalCount: proposalsStore.filter(p => p.jobId === j.id).length,
    createdAt: j.createdAt,
  }));

  res.json(results);
});

// GET /api/v1/jobs/:id
app.get('/api/v1/jobs/:id', (req, res) => {
  const job = jobsStore.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

// POST /api/v1/jobs (Client create job)
app.post('/api/v1/jobs', (req, res) => {
  const { title, description, roleCategory, channel, budgetMinorMin, budgetMinorMax } = req.body || {};

  if (!title || !description || !roleCategory) {
    return res.status(400).json({ error: 'Title, description, and roleCategory are required.' });
  }

  const user = getAuthenticatedUser(req);
  const clientId = user?.clientProfileId || SEED_CLIENT_PROFILE_ID;
  const client = clientProfiles.get(clientId);

  const newJob = {
    id: crypto.randomUUID(),
    clientId,
    clientName: client?.companyName || 'Nexus Labs Inc.',
    title: title.trim(),
    description: description.trim(),
    roleCategory: roleCategory.trim(),
    channel: channel || 'B2C',
    status: 'Open',
    budgetMinorMin: budgetMinorMin ? Number(budgetMinorMin) : undefined,
    budgetMinorMax: budgetMinorMax ? Number(budgetMinorMax) : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  jobsStore.unshift(newJob);

  res.status(201).json({
    id: newJob.id,
    title: newJob.title,
    status: newJob.status,
  });
});

// POST /api/v1/jobs/:id/proposals (Freelancer apply to job)
app.post('/api/v1/jobs/:id/proposals', (req, res) => {
  const job = jobsStore.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const user = getAuthenticatedUser(req);
  const freelancerId = user?.freelancerProfileId || SEED_FREELANCER_PROFILE_ID;
  const { coverNote, proposedRateMinor } = req.body || {};

  const proposal = {
    id: crypto.randomUUID(),
    jobId: job.id,
    freelancerId,
    coverNote: coverNote || '',
    proposedRateMinor: proposedRateMinor ? Number(proposedRateMinor) : (job.budgetMinorMin || 200000000),
    status: 'Submitted',
    createdAt: new Date().toISOString(),
  };

  proposalsStore.push(proposal);

  res.status(201).json({
    id: proposal.id,
    status: proposal.status,
  });
});

// GET /api/v1/proposals/mine
app.get('/api/v1/proposals/mine', (req, res) => {
  const user = getAuthenticatedUser(req);
  const freelancerId = user?.freelancerProfileId || SEED_FREELANCER_PROFILE_ID;

  const mine = proposalsStore
    .filter(p => p.freelancerId === freelancerId)
    .map(p => {
      const job = jobsStore.find(j => j.id === p.jobId);
      return {
        id: p.id,
        jobId: p.jobId,
        jobTitle: job?.title || 'Distributed Systems Role',
        clientName: job?.clientName || 'Nexus Labs Inc.',
        proposedRateMinor: p.proposedRateMinor,
        status: p.status,
        createdAt: p.createdAt,
      };
    });

  res.json(mine);
});

// GET /api/v1/freelancers
app.get('/api/v1/freelancers', (req, res) => {
  const { role, q } = req.query || {};
  let list = Array.from(freelancerProfiles.values());

  if (role) {
    list = list.filter(f => f.primaryRole.toLowerCase() === String(role).toLowerCase());
  }

  if (q) {
    const term = String(q).trim().toLowerCase();
    list = list.filter(f =>
      f.displayName.toLowerCase().includes(term) ||
      f.primaryRole.toLowerCase().includes(term) ||
      (f.headline && f.headline.toLowerCase().includes(term))
    );
  }

  const results = list.map(f => ({
    id: f.id,
    displayName: f.displayName,
    headline: f.headline,
    primaryRole: f.primaryRole,
    rateBand: f.rateBand || 'Band2',
    experienceLevel: f.experienceLevel || 'Senior',
    hourlyRateMinor: f.hourlyRateMinor,
    isFullyVerified: f.isFullyVerified ?? true,
  }));

  res.json(results);
});

// GET /api/v1/freelancers/:id
app.get('/api/v1/freelancers/:id', (req, res) => {
  const freelancer = freelancerProfiles.get(req.params.id);
  if (!freelancer) {
    return res.status(404).json({ error: 'Freelancer not found' });
  }
  res.json({
    id: freelancer.id,
    displayName: freelancer.displayName,
    headline: freelancer.headline,
    bio: freelancer.bio,
    primaryRole: freelancer.primaryRole,
    rateBand: freelancer.rateBand || 'Band2',
    experienceLevel: freelancer.experienceLevel || 'Senior',
    hourlyRateMinor: freelancer.hourlyRateMinor,
    isFullyVerified: freelancer.isFullyVerified ?? true,
  });
});

// POST /api/v1/freelancers/register
app.post('/api/v1/freelancers/register', (req, res) => {
  const { email, password, displayName, primaryRole, panNumber, aadhaarNumber, epfUan } = req.body || {};

  const errors = {};

  if (!email || !email.includes('@')) {
    errors.email = ['A valid email address is required.'];
  }
  if (!password || password.length < 8) {
    errors.password = ['Password must be at least 8 characters long.'];
  }
  if (!displayName || !displayName.trim()) {
    errors.displayName = ['Full name is required.'];
  }
  if (!primaryRole || !primaryRole.trim()) {
    errors.primaryRole = ['Primary role is required.'];
  }

  const panError = validatePan(panNumber);
  if (panError) {
    errors.panNumber = [panError];
  }

  const aadhaarError = validateAadhaar(aadhaarNumber);
  if (aadhaarError) {
    errors.aadhaarNumber = [aadhaarError];
  }

  if (epfUan && !/^[0-9]{12}$/.test(epfUan.trim())) {
    errors.epfUan = ['EPF UAN must be exactly 12 digits.'];
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const userId = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const normalizedPan = panNumber.trim().toUpperCase();
  const normalizedAadhaar = aadhaarNumber.replace(/\s+/g, '').trim();

  const profile = {
    id: profileId,
    userId,
    displayName: displayName.trim(),
    headline: `${primaryRole.trim()} Specialist`,
    primaryRole: primaryRole.trim(),
    rateBand: 'Band2',
    experienceLevel: 'Senior',
    hourlyRateMinor: 200000,
    panStatus: 'Eligible',
    aadhaarStatus: 'Eligible',
    epfStatus: epfUan ? 'NeedsReview' : 'Pending',
    isFullyVerified: !epfUan,
  };

  usersStore.set(userId, {
    id: userId,
    email: email.trim().toLowerCase(),
    password,
    role: 'Freelancer',
    displayName: displayName.trim(),
    freelancerProfileId: profileId,
    clientProfileId: null,
    isFullyVerified: profile.isFullyVerified,
    createdAt: new Date().toISOString(),
  });

  freelancerProfiles.set(profileId, {
    ...profile,
    panNumber: normalizedPan,
    aadhaarLast4: normalizedAadhaar.slice(-4),
    epfUan: epfUan ? epfUan.trim() : null,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    userId,
    profile: {
      displayName: profile.displayName,
      panStatus: profile.panStatus,
      aadhaarStatus: profile.aadhaarStatus,
      epfStatus: profile.epfStatus,
      isFullyVerified: profile.isFullyVerified,
    },
  });
});

// POST /api/v1/clients/register
app.post('/api/v1/clients/register', (req, res) => {
  const { email, password, companyName, gstin } = req.body || {};

  const errors = {};

  if (!email || !email.includes('@')) {
    errors.email = ['A valid email address is required.'];
  }
  if (!password || password.length < 8) {
    errors.password = ['Password must be at least 8 characters long.'];
  }
  if (!companyName || !companyName.trim()) {
    errors.companyName = ['Company name is required.'];
  }

  const gstinError = validateGstin(gstin);
  if (gstinError) {
    errors.gstin = [gstinError];
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const userId = crypto.randomUUID();
  const profileId = crypto.randomUUID();
  const profile = {
    id: profileId,
    userId,
    companyName: companyName.trim(),
    gstin: gstin ? gstin.trim().toUpperCase() : null,
    plan: 'Standard',
    negotiatedFeeRate: null,
  };

  usersStore.set(userId, {
    id: userId,
    email: email.trim().toLowerCase(),
    password,
    role: 'Client',
    displayName: companyName.trim(),
    freelancerProfileId: null,
    clientProfileId: profileId,
    isFullyVerified: true,
    createdAt: new Date().toISOString(),
  });

  clientProfiles.set(profileId, {
    ...profile,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    userId,
    profile: {
      companyName: profile.companyName,
      gstin: profile.gstin,
      plan: profile.plan,
    },
  });
});

// GET /api/v1/dashboard/freelancer
app.get('/api/v1/dashboard/freelancer', (req, res) => {
  const user = getAuthenticatedUser(req);
  const freelancerId = user?.freelancerProfileId || SEED_FREELANCER_PROFILE_ID;
  const profile = freelancerProfiles.get(freelancerId) || freelancerProfiles.get(SEED_FREELANCER_PROFILE_ID);

  const contracts = contractsStore
    .filter(c => c.freelancerId === freelancerId || freelancerId === SEED_FREELANCER_PROFILE_ID)
    .map(c => ({
      id: c.id,
      scopeSummary: c.scopeSummary,
      status: c.status,
      channel: c.channel,
      jobTitle: c.jobTitle,
      counterpartyName: c.counterpartyName,
      clientName: c.clientName,
      createdAt: c.createdAt,
      contractValueMinor: c.contractValueMinor,
      milestones: milestonesStore
        .filter(m => m.contractId === c.id)
        .map(m => ({
          id: m.id,
          title: m.title,
          contractValueMinor: m.contractValueMinor,
          state: m.state,
          reviewWindowDays: m.reviewWindowDays,
          fundedAt: m.fundedAt,
          submittedAt: m.submittedAt,
          reviewDeadlineAt: m.reviewDeadlineAt,
          releasedAt: m.releasedAt,
        })),
    }));

  const allMilestones = contracts.flatMap(c => c.milestones);

  const pendingInEscrowMinor = allMilestones
    .filter(m => m.state === 'Funded' || m.state === 'InProgress' || m.state === 'Submitted')
    .reduce((sum, m) => sum + m.contractValueMinor, 0);

  const totalEarnedMinor = ledgerEntriesStore
    .filter(l => l.type === 'FreelancerPayout')
    .reduce((sum, l) => sum + l.amountMinor, 0);

  const openProposalsCount = proposalsStore.filter(p => p.freelancerId === freelancerId && p.status === 'Submitted').length;

  const now = new Date();
  const fyYear = now.getUTCMonth() >= 3 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
  const fyStart = new Date(Date.UTC(fyYear, 3, 1)).toISOString();

  res.json({
    profile: {
      id: profile.id,
      displayName: profile.displayName,
      headline: profile.headline,
      primaryRole: profile.primaryRole,
      rateBand: profile.rateBand || 'Band3',
      experienceLevel: profile.experienceLevel || 'Staff',
      hourlyRateMinor: profile.hourlyRateMinor,
      isFullyVerified: profile.isFullyVerified ?? true,
      panStatus: profile.panStatus || 'Eligible',
      aadhaarStatus: profile.aadhaarStatus || 'Eligible',
    },
    summary: {
      activeContracts: contracts.filter(c => c.status === 'Active').length,
      totalEarnedMinor,
      pendingInEscrowMinor,
      openProposalsCount,
    },
    contracts,
    taxSummary: {
      financialYearStart: fyStart,
      fyToDateEarnedMinor: totalEarnedMinor,
      totalGstCollectedMinor: 0,
      estimatedTdsMinor: Math.max(0, Math.round((totalEarnedMinor - 50000000) * 0.001)),
      note: 'Estimated for planning only, not a filed tax record. TDS estimate follows Income Tax Act Section 194-O (0.1% on cumulative payments once they cross ₹5,00,000 in the financial year).',
    },
    recommendedJobs: jobsStore.slice(0, 3).map(j => ({
      id: j.id,
      title: j.title,
      roleCategory: j.roleCategory,
      budgetMinorMin: j.budgetMinorMin,
      budgetMinorMax: j.budgetMinorMax,
      clientName: j.clientName || 'Nexus Labs Inc.',
    })),
  });
});

// GET /api/v1/dashboard/client
app.get('/api/v1/dashboard/client', (req, res) => {
  const user = getAuthenticatedUser(req);
  const clientId = user?.clientProfileId || SEED_CLIENT_PROFILE_ID;
  const profile = clientProfiles.get(clientId) || clientProfiles.get(SEED_CLIENT_PROFILE_ID);

  const contracts = contractsStore
    .filter(c => c.clientId === clientId || clientId === SEED_CLIENT_PROFILE_ID)
    .map(c => ({
      id: c.id,
      scopeSummary: c.scopeSummary,
      status: c.status,
      jobTitle: c.jobTitle,
      freelancerName: c.freelancerName,
      freelancerRole: c.freelancerRole,
      createdAt: c.createdAt,
      milestones: milestonesStore
        .filter(m => m.contractId === c.id)
        .map(m => ({
          id: m.id,
          title: m.title,
          contractValueMinor: m.contractValueMinor,
          state: m.state,
          fundedAt: m.fundedAt,
          submittedAt: m.submittedAt,
          reviewDeadlineAt: m.reviewDeadlineAt,
          releasedAt: m.releasedAt,
        })),
    }));

  const pendingApprovals = milestonesStore
    .filter(m => m.state === 'Submitted')
    .map(m => {
      const contract = contractsStore.find(c => c.id === m.contractId);
      return {
        id: m.id,
        contractId: m.contractId,
        title: m.title,
        contractValueMinor: m.contractValueMinor,
        freelancerName: contract?.freelancerName || 'Arjun Mehta',
        submittedAt: m.submittedAt,
        reviewDeadlineAt: m.reviewDeadlineAt,
      };
    });

  // Calculate current escrow balance: total EscrowFund minus payouts/fees
  const totalFunded = ledgerEntriesStore
    .filter(l => l.type === 'EscrowFund')
    .reduce((sum, l) => sum + l.amountMinor, 0);
  const totalReleased = ledgerEntriesStore
    .filter(l => l.type === 'FreelancerPayout' || l.type === 'ClientFee' || l.type === 'FreelancerFee')
    .reduce((sum, l) => sum + l.amountMinor, 0);
  const escrowBalanceMinor = Math.max(0, totalFunded - totalReleased);

  const postedJobs = jobsStore
    .filter(j => j.clientId === clientId || clientId === SEED_CLIENT_PROFILE_ID)
    .map(j => ({
      id: j.id,
      title: j.title,
      status: j.status,
      proposalCount: proposalsStore.filter(p => p.jobId === j.id).length,
      createdAt: j.createdAt,
    }));

  res.json({
    profile: {
      id: profile.id,
      companyName: profile.companyName,
      gstin: profile.gstin,
      plan: profile.plan || 'Standard',
      negotiatedFeeRate: profile.negotiatedFeeRate,
    },
    summary: {
      activeContracts: contracts.filter(c => c.status === 'Active').length,
      escrowBalanceMinor,
      pendingApprovalsCount: pendingApprovals.length,
      openJobsCount: postedJobs.filter(j => j.status === 'Open').length,
    },
    contracts,
    pendingApprovals,
    postedJobs,
  });
});

// --- Milestone Action Endpoints ---

// POST /api/v1/milestones/:id/fund
app.post('/api/v1/milestones/:id/fund', (req, res) => {
  const milestone = milestonesStore.find(m => m.id === req.params.id);
  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  if (milestone.state !== 'Unfunded') {
    return res.status(409).json({ error: `Cannot fund milestone in '${milestone.state}' state.` });
  }

  const fees = calculateFees(milestone.contractValueMinor, 'Standard');
  milestone.state = 'Funded';
  milestone.fundedAt = new Date().toISOString();

  ledgerEntriesStore.push({
    id: `l-fund-${Date.now()}`,
    milestoneId: milestone.id,
    type: 'EscrowFund',
    amountMinor: fees.clientPaysTotalMinor,
    createdAt: new Date().toISOString(),
  });

  res.json({
    milestoneId: milestone.id,
    state: milestone.state,
    fees,
  });
});

// POST /api/v1/milestones/:id/start
app.post('/api/v1/milestones/:id/start', (req, res) => {
  const milestone = milestonesStore.find(m => m.id === req.params.id);
  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  if (milestone.state !== 'Funded') {
    return res.status(409).json({ error: `Cannot start milestone in '${milestone.state}' state.` });
  }

  milestone.state = 'InProgress';
  res.json({
    milestoneId: milestone.id,
    state: milestone.state,
  });
});

// POST /api/v1/milestones/:id/submit
app.post('/api/v1/milestones/:id/submit', (req, res) => {
  const milestone = milestonesStore.find(m => m.id === req.params.id);
  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  if (milestone.state !== 'InProgress') {
    return res.status(409).json({ error: `Cannot submit milestone in '${milestone.state}' state.` });
  }

  const now = new Date();
  const reviewDeadline = new Date(now.getTime() + (milestone.reviewWindowDays || 5) * 24 * 60 * 60 * 1000);

  milestone.state = 'Submitted';
  milestone.submittedAt = now.toISOString();
  milestone.reviewDeadlineAt = reviewDeadline.toISOString();

  res.json({
    milestoneId: milestone.id,
    state: milestone.state,
    reviewDeadlineAt: milestone.reviewDeadlineAt,
  });
});

// POST /api/v1/milestones/:id/approve
app.post('/api/v1/milestones/:id/approve', (req, res) => {
  const milestone = milestonesStore.find(m => m.id === req.params.id);
  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  if (milestone.state !== 'Submitted') {
    return res.status(409).json({ error: `Cannot approve milestone in '${milestone.state}' state.` });
  }

  const fees = calculateFees(milestone.contractValueMinor, 'Standard');
  const now = new Date().toISOString();

  milestone.state = 'ApprovedReleased';
  milestone.releasedAt = now;

  ledgerEntriesStore.push(
    {
      id: `l-payout-${Date.now()}`,
      milestoneId: milestone.id,
      type: 'FreelancerPayout',
      amountMinor: fees.freelancerReceivesMinor,
      createdAt: now,
    },
    {
      id: `l-clientfee-${Date.now()}`,
      milestoneId: milestone.id,
      type: 'ClientFee',
      amountMinor: fees.clientFeeMinor,
      createdAt: now,
    },
    {
      id: `l-freelancerfee-${Date.now()}`,
      milestoneId: milestone.id,
      type: 'FreelancerFee',
      amountMinor: fees.freelancerFeeMinor,
      createdAt: now,
    }
  );

  res.json({
    milestoneId: milestone.id,
    state: milestone.state,
    fees,
  });
});

// --- Static Frontend Serving & Fallback ---
let distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  distDir = path.join(__dirname, 'frontend-web', 'verqo-web', 'dist', 'verqo-web', 'browser');
}

// If the Angular build doesn't exist yet, build it once
if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'))) {
  console.log('[AI Studio] Angular build not found, building frontend...');
  try {
    execSync('npm run build:frontend', { stdio: 'inherit', cwd: __dirname });
    if (fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
      distDir = path.join(__dirname, 'dist');
    } else if (fs.existsSync(path.join(__dirname, 'frontend-web', 'verqo-web', 'dist', 'verqo-web', 'browser', 'index.html'))) {
      distDir = path.join(__dirname, 'frontend-web', 'verqo-web', 'dist', 'verqo-web', 'browser');
    }
  } catch (err) {
    console.error('[AI Studio] Failed to build frontend:', err);
  }
}

// Return 404 JSON for unmatched API endpoints
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.status(503).send('Application is still compiling. Please refresh in a moment.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
