import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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

// In-memory data store for jobs, freelancers, and clients
const jobsStore = [
  {
    id: 'e7b8f9a0-1234-4567-89ab-cdef01234567',
    clientId: 'c1111111-2222-3333-4444-555555555555',
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
    channel: 0,
    status: 0,
    budgetMinorMin: 250000000,
    budgetMinorMax: 350000000,
    createdAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: 'f8c9d0e1-2345-5678-9abc-def012345678',
    clientId: 'c2222222-3333-4444-5555-666666666666',
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
    channel: 0,
    status: 0,
    budgetMinorMin: 200000000,
    budgetMinorMax: 300000000,
    createdAt: '2026-09-19T14:30:00.000Z',
    updatedAt: '2026-09-19T14:30:00.000Z',
  },
  {
    id: 'a1b2c3d4-3456-6789-abcd-ef0123456789',
    clientId: 'c3333333-4444-5555-6666-777777777777',
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
    channel: 1,
    status: 0,
    budgetMinorMin: 180000000,
    budgetMinorMax: 240000000,
    createdAt: '2026-09-20T08:15:00.000Z',
    updatedAt: '2026-09-20T08:15:00.000Z',
  },
  {
    id: 'b2c3d4e5-4567-789a-bcde-f0123456789a',
    clientId: 'c4444444-5555-6666-7777-888888888888',
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
    channel: 0,
    status: 0,
    budgetMinorMin: 220000000,
    budgetMinorMax: 320000000,
    createdAt: '2026-09-21T07:45:00.000Z',
    updatedAt: '2026-09-21T07:45:00.000Z',
  },
];

const usersStore = new Map();
const freelancerProfiles = new Map();
const clientProfiles = new Map();

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

// --- API Routes ---

// GET /api/v1/jobs
app.get('/api/v1/jobs', (req, res) => {
  const summaries = jobsStore.map(j => ({
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

// GET /api/v1/jobs/:id
app.get('/api/v1/jobs/:id', (req, res) => {
  const job = jobsStore.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
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
  const normalizedPan = panNumber.trim().toUpperCase();
  const normalizedAadhaar = aadhaarNumber.replace(/\s+/g, '').trim();

  const profile = {
    displayName: displayName.trim(),
    panStatus: 'Eligible',
    aadhaarStatus: 'Eligible',
    epfStatus: epfUan ? 'NeedsReview' : 'Pending',
    isFullyVerified: true,
  };

  usersStore.set(userId, {
    id: userId,
    email: email.trim().toLowerCase(),
    role: 'Freelancer',
    createdAt: new Date().toISOString(),
  });

  freelancerProfiles.set(userId, {
    userId,
    ...profile,
    panNumber: normalizedPan,
    aadhaarLast4: normalizedAadhaar.slice(-4),
    epfUan: epfUan ? epfUan.trim() : null,
  });

  res.status(201).json({
    userId,
    profile,
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
  const profile = {
    companyName: companyName.trim(),
    gstin: gstin ? gstin.trim().toUpperCase() : null,
    plan: 'Standard',
  };

  usersStore.set(userId, {
    id: userId,
    email: email.trim().toLowerCase(),
    role: 'Client',
    createdAt: new Date().toISOString(),
  });

  clientProfiles.set(userId, {
    userId,
    ...profile,
  });

  res.status(201).json({
    userId,
    profile,
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
