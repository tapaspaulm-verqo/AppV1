# Verqo — Architecture Rebuild (v2)

This document records the decisions behind rebuilding Verqo on a new stack,
per the brief: .NET backend/API for all three front ends, Angular for web,
a chosen mobile UI framework, an "easy maintainable, minimum downtime"
database, Kubernetes/container-native deployment, dummy payment gateway and
escrow deferred to v2a, and freelancer registration extended with PAN,
Aadhaar and an EPF active-account check.

It supersedes the original MVP scaffold's stack (Next.js + Fastify +
Prisma + Cloud Spanner) while keeping its domain model, business rules and
brand identity intact — this is a stack rebuild, not a product rebuild.

## 1. What carried over unchanged

- **Domain model.** Every entity from the original Prisma schema (User,
  VerificationCheck, FreelancerProfile, ClientProfile, Job, Proposal,
  Contract, Milestone, LedgerEntry, Payout, Invoice, Message, Review,
  Dispute) exists in `backend/src/Verqo.Domain`, field-for-field, plus the
  new PAN/Aadhaar/EPF fields on `FreelancerProfile`.
- **Business rules.** Fee calculation (5% freelancer / 10% standard client /
  5% Business Plus floor) and the milestone state machine are ported 1:1
  from `packages/shared/business-rules.ts` into
  `backend/src/Verqo.Application/Common/BusinessRules.cs` — same constants,
  same transition table, same behaviour.
- **Brand identity.** Black/silver/white/green palette, IBM Plex Sans
  (headings) + Inter (body) — identical CSS variables in the Angular app's
  `styles.css`, the same values hand-coded into the Flutter theme, so all
  three clients render as one brand.
- **The payment-gateway abstraction pattern.** `IPaymentGatewayAdapter` /
  `MockPaymentGatewayAdapter` is a direct port of the original TypeScript
  gateway interface — same reasoning, same "swap the adapter, not the
  callers" design, now also the template the new `IKycVerificationService`
  follows (see §5).

## 2. Backend: ASP.NET Core, Clean Architecture, one API for three clients

```
backend/
  src/
    Verqo.Domain/          entities, enums — zero dependencies
    Verqo.Application/     business rules, KYC validators, use-case services — zero dependencies
    Verqo.Infrastructure/  EF Core + Npgsql DbContext, entity configuration
    Verqo.Api/              ASP.NET Core Web API — controllers, auth, DI wiring, Dockerfile
  tests/
    Verqo.Application.Tests/  xunit test suite (the intended one — see §7)
  tools/
    Verqo.OfflineSmokeTests/  dependency-free console test runner (see §7)
```

One ASP.NET Core Web API (`Verqo.Api`) serves the Angular web app, the
Android app and the iOS app identically — there is no separate "web API"
vs. "mobile API." Versioned under `/api/v1`, JSON over HTTPS, JWT bearer
auth. This is the same "single backend, multiple thin clients" shape the
original Fastify API already had (the web app was already calling it as a
separate service), just re-platformed.

Why Clean Architecture (Domain → Application → Infrastructure → Api) rather
than one project: `Verqo.Domain` and `Verqo.Application` have **zero**
external package dependencies. That's not a style preference — it means the
freelancer registration flow and every business rule can be built and unit
tested without a database, without ASP.NET Core, without anything but the
C# compiler. That property is what let the PAN/Aadhaar logic actually be
verified inside this build sandbox (§7), and it'll keep paying off in real
CI (fast, hermetic unit tests for the highest-scrutiny logic).

## 3. Web: Angular

`frontend-web/verqo-web` — Angular 18, standalone components (no NgModules),
reactive forms, `HttpClient`. Structure:

```
src/app/
  core/
    services/api.service.ts       thin wrapper over Verqo.Api
    validators/pan.validator.ts   client-side PAN check (mirrors the API's)
    validators/aadhaar.validator.ts  client-side Aadhaar check (mirrors the API's)
  shared/header/                  nav
  pages/home, jobs, freelancer-signup, client-signup
```

`ng build` succeeds in this environment (Angular CLI, npm — both reachable);
see §7.

## 4. Mobile: Flutter (chosen over .NET MAUI / React Native)

The brief left the mobile UI framework open. Three real options and why
Flutter won:

- **.NET MAUI** — single language (C#) across backend and mobile, smallest
  hiring/tooling surface for a small team. Weighed against: MAUI's
  production maturity and Android performance/consistency on the lower- and
  mid-tier devices common across India (where much of Verqo's freelancer
  base will be) still lags Flutter's, and its community package ecosystem
  is thinner.
- **React Native** — huge ecosystem, JS/TS (shared skill with an Angular
  team). Weighed against: bridge-based architecture has historically had
  more performance variance on lower-end Android hardware than Flutter's
  compiled approach, and it's a third language (JS) alongside C# and
  TypeScript rather than reusing either.
- **Flutter (chosen)** — compiles to native ARM code, which matters
  concretely for a two-sided marketplace where freelancers are on a wide
  spread of Android device tiers; proven at large scale in India (Google
  Pay and many Indian startups ship on it) for exactly this
  device-diversity reason; one Dart codebase covers Android and iOS with
  near-pixel-identical custom UI, which matters for a brand this specific
  (IBM Plex Sans/Inter, exact colour tokens) rather than a stock
  Material/Cupertino look.

This is a genuine trade-off, not a clear-cut win — a team that wants to
stay entirely inside C#/.NET should pick MAUI instead, and `IKycVerificationService`,
`IPaymentGatewayAdapter` and the whole API contract are framework-agnostic,
so switching mobile frameworks later doesn't touch the backend at all.

`mobile/verqo_mobile` — Flutter project structure (`lib/theme`,
`lib/services/api_client.dart`, `lib/validators/kyc_validators.dart`,
`lib/screens/`, `test/`). Covers the three flows the backend actually
supports today: freelancer registration (PAN/Aadhaar/EPF UAN), client
registration (company name + optional GSTIN), and browsing open roles —
behind a bottom-nav app shell, with unit tests for the validators and
widget tests for navigation. Written as source only — see §7 for why it
couldn't be built in this sandbox, and `mobile/verqo_mobile/README.md` for
how to pick it up with a real Flutter install (or just push — see §7.2).

## 5. PAN, Aadhaar and EPF verification

Per the brief: freelancer registration must capture PAN and Aadhaar with
automatic validation, and check active EPF status. What "automatic
validation" can honestly mean today, and what's deferred:

**Real, running today — no vendor needed:**

- **PAN format.** `AAAAA9999A` structure plus the documented holder-type
  code in position 4 (public, CBDT-defined). No public checksum digit
  exists for PAN — full verification needs the Income Tax Department's
  "Verify PAN" API.
- **Aadhaar format + checksum.** 12 digits, first digit 2-9, and the
  Verhoeff checksum digit UIDAI uses for Aadhaar numbers. The Verhoeff
  algorithm (Jacobus Verhoeff, 1969) is public-domain arithmetic — running
  it locally genuinely catches a mistyped Aadhaar number today, with no
  network call. Implemented identically three times (C#, TypeScript, Dart)
  so all three clients give the same instant feedback before the number
  ever reaches the API.

**Mocked, behind a swappable interface — needs a licensed vendor:**

`IKycVerificationService` (`Verqo.Application/Kyc/IKycVerificationService.cs`)
is the same "adapter interface, mock implementation, open vendor decision"
pattern `IPaymentGatewayAdapter` already used for payments:

| Check | Why it's mocked | Real integration path |
|---|---|---|
| PAN really exists / matches the name | No public API | Income Tax Dept.'s "Verify PAN" API via a registered ERI/agency (e.g. Protean, formerly NSDL e-Gov), or the e-Filing portal's API — needs a signed agreement |
| Aadhaar really belongs to this person | Restricted by law | UIDAI Aadhaar Paperless Offline e-KYC or the e-KYC "Yes/No" API — restricted to authorised AUA/KUA entities, or a licensed KYC-as-a-service aggregator |
| EPF UAN is an active member | No public API exists at all | EPFO exposes member data only via the member's own OTP-authenticated portal session, or via an RBI Account Aggregator-framework partner — needs a signed agreement either way |

`MockKycVerificationService` runs the real offline checks above and then
simulates a vendor response — PAN/Aadhaar come back `Eligible` on valid
input, EPF always comes back `NeedsReview` (there is no offline check for
"is this UAN active," so it's honestly routed to manual review rather than
faked as verified). Swapping in a real vendor later is a new class
implementing the interface — no controller or Angular/Flutter changes.

**Storage — a compliance decision, not an oversight.** The Aadhaar Act,
2016 (s.29) and UIDAI regulations restrict who may even *store* a full
Aadhaar number — that requires UIDAI AUA/KUA authorisation, which Verqo
does not have. `FreelancerProfile` therefore never stores the full number:
only the last 4 digits (for UI display, the same masking convention UIDAI
itself uses) and a salted SHA-256 hash (`AadhaarValidator.Hash`, pepper
from `Kyc__AadhaarHashPepper` — see the Kubernetes Secret in
`deploy/helm/verqo/examples/secrets-example.yaml`) for duplicate-account
detection. The full number is validated in memory at submission time and
discarded. PAN has no such restriction and is stored as-is (it's routinely
shown on invoices, Form 16, etc.). EPF UAN gets the same last-4-only
treatment as Aadhaar, out of caution, even though it's not under the same
statute.

## 6. Database: managed PostgreSQL, not Cloud Spanner

The original schema's own comment said production would target Cloud
Spanner (dual-region India, 99.999% SLA, chosen for strong transactional
consistency on the escrow ledger). This rebuild's brief asks for "easy
maintainable, with minimum downtime" instead — a different, and for this
stage more appropriate, point on the trade-off curve:

- **Chosen: managed PostgreSQL with regional/zonal HA** — Cloud SQL for
  PostgreSQL (Enterprise Plus, HA config) if staying on GCP, or the
  equivalent (RDS for PostgreSQL Multi-AZ / Azure Database for PostgreSQL
  Flexible Server zone-redundant HA) on another cloud. Automatic failover,
  automated backups and point-in-time recovery, and minor-version patching
  are the provider's job, not the team's — that's what "easy maintainable"
  means in practice. Typical HA SLA is 99.95%, not Spanner's 99.999%, which
  is the honest cost of this trade.
- **EF Core + Npgsql** is a first-class, mainstream combination — no
  exotic tooling, large community, works identically against any Postgres
  provider.
- **Migration path stays open.** The original schema was deliberately kept
  Spanner-portable (string IDs, no Postgres-only features, since Spanner
  exposes a PostgreSQL interface) — `Verqo.Domain`/`Verqo.Infrastructure`
  kept that same discipline, so pointing Npgsql at Spanner's PostgreSQL
  interface later, if consistency/scale needs outgrow managed Postgres, is
  a connection-string change, not a rewrite.
- **Not chosen: Postgres inside Kubernetes** (e.g. via the CloudNativePG
  operator). Fully plausible for a team that wants everything
  cluster-native, but it moves failover, backups and patching onto the
  platform team — the opposite of "easy maintainable" for a small team.
  `deploy/helm/verqo` deploys no database at all; it only references an
  external connection string (see §8).

## 7. What was actually built, verified, and what's scaffold-only

This was built inside a sandboxed environment whose network egress only
reaches a specific allowlist (npm, PyPI, crates.io, jsr.io, Anthropic
hosts, and GitHub — **not** `api.nuget.org` or any NuGet mirror tried
(`globalcdn.nuget.org`, GitHub Packages' NuGet endpoint, Azure DevOps/blob
storage), **not** `proxy.golang.org` (needed to `go install helm`), and
**not** Flutter's SDK host, `storage.googleapis.com`). That's a hard
policy block on this sandbox, confirmed by probing each host directly
(all return 403 on the CONNECT tunnel) — not a transient outage, so it
was not retried once confirmed. That shaped what could be proven to work
here versus what's written correctly but unverified:

| Layer | Status here | Why |
|---|---|---|
| `Verqo.Domain`, `Verqo.Application` | **Builds.** `dotnet build` succeeds, zero warnings. | Zero external NuGet packages. |
| PAN/Aadhaar validators, fee calculation, milestone state machine, freelancer registration flow | **Built AND tested — 38/38 assertions pass.** Run it yourself: `dotnet run --project backend/tools/Verqo.OfflineSmokeTests`. | Same reason — no NuGet needed, so real execution was possible here. |
| `Verqo.Application.Tests` (xunit) | Source-complete, **not run here** (xunit needs `Microsoft.NET.Test.Sdk` from NuGet). CI (below) is where this actually runs. | `api.nuget.org` isn't reachable from this sandbox. Restores and runs normally in any ordinary dev/CI environment — that's the suite to trust and extend. |
| `Verqo.Infrastructure` (EF Core/Npgsql), `Verqo.Api` (ASP.NET Core, JWT, Swagger) — includes login/JWT issuance (AuthController), Contracts/Milestones/Jobs/Proposals/Freelancers-search controllers, and the two dashboard aggregate endpoints added for the Freelancer/Client post-login views | Source-complete, idiomatic, **not built here** — same NuGet restriction (`Microsoft.EntityFrameworkCore`, `Npgsql.EntityFrameworkCore.PostgreSQL`, `Microsoft.AspNetCore.Authentication.JwtBearer`, `Swashbuckle.AspNetCore` are all NuGet-only). Compensated with a manual line-by-line review pass, which caught and fixed two real compile errors the compiler couldn't catch here (see below). | Will restore and build the moment this solution is opened anywhere with normal NuGet access — CI does this on every push. |
| `Verqo.Infrastructure/Migrations` (InitialCreate — the first real schema: all 14 tables) | The Up()/Down() SQL **was genuinely verified** — applied to a real local PostgreSQL 16 instance in this sandbox (`apt`-installed, no NuGet needed to run `psql`/`pg_ctlcluster`), then a full users → profiles → job → contract → milestone → ledger_entries insert chain round-tripped through every foreign key with no error. The Designer.cs/ModelSnapshot.cs pair (needed for `dotnet ef migrations add` tooling, not for `Database.Migrate()` itself) is hand-written and **not** tool-verified here. | The new `migration-consistency` CI job (below) applies this migration to a real Postgres service container and asserts `dotnet ef migrations add` detects zero pending changes — the real check on whether the hand-written snapshot actually matches `VerqoDbContext`. |
| Angular web app | **Builds.** `ng build` succeeds (1.61 MB initial bundle, dev config). | npm/Angular CLI are reachable here. |
| Flutter mobile app | Source-complete Dart (freelancer signup, client signup, jobs list, validators incl. a new GSTIN check, unit + widget tests), **not built or analyzed here** — the Flutter SDK, `pub.dev`, and `dl.google.com`/`maven.google.com` are all unreachable from this sandbox (confirmed by direct probe, not just the earlier `storage.googleapis.com` finding). | `.github/workflows/flutter.yml` builds it for real on push — see §7.2. Or run `flutter create --platforms=android .` in `mobile/verqo_mobile` with a real install. |
| Helm chart | Structurally validated (Go-template directives stripped, remainder parsed as YAML — every file parses cleanly) but **not run through `helm lint`/`helm template`** — the `helm` binary's install path (`proxy.golang.org` via `go install`) was also unreachable from this sandbox. | Run `helm lint deploy/helm/verqo` for real before a production install. |

A `NuGet.Config` at `backend/` clears the default package source so the
projects that need no packages (`Verqo.Domain`, `Verqo.Application`, the
smoke-test tool) restore instantly here instead of failing on an
unreachable `nuget.org`. Delete it, or point it at your real feed, once
this is opened somewhere with normal network access.

### 7.1 Getting the NuGet-blocked projects actually building and tested

Two things changed to make this concrete rather than just documented:

1. **`.github/workflows/dotnet.yml`** — a GitHub Actions workflow
   (checkout → `setup-dotnet@v4` → remove the sandbox-only `NuGet.Config`
   → `dotnet restore Verqo.sln` → `dotnet build` → `dotnet test
   tests/Verqo.Application.Tests` → run the offline smoke tests too) that
   fires on every push/PR touching `backend/**`. A normal GitHub Actions
   runner has unrestricted NuGet access, so **this is the real place
   `Verqo.Infrastructure`, `Verqo.Api`, and the xunit suite get restored,
   built, and run** — push this repo (or open a PR) and check the Actions
   tab. This isn't a workaround for the sandbox limitation; it's the
   correct permanent CI for the project either way.
2. **Manual code review**, since the compiler itself couldn't check these
   three projects here. This caught two real bugs that would otherwise
   have surfaced as build failures the first time CI (or a developer) ran
   them:
   - `Verqo.Api/Program.cs`: `public partial class Program;` is invalid
     C# — a plain class can't end in a bare semicolon (only a record with
     a primary constructor can). Fixed to `public partial class Program
     { }`.
   - `Verqo.Api/Controllers/FreelancersController.cs`: the validation
     error path called `ValidationProblem(new
     ValidationProblemDetails(errorsDict))`, relying on an overload of
     `ControllerBase.ValidationProblem` that isn't confirmed to exist for
     a hand-built `ValidationProblemDetails` (only the `ModelStateDictionary`
     overload is certain). Replaced with `BadRequest(new
     ValidationProblemDetails(errors))`, which uses the unambiguous
     `BadRequest(object?)` overload and returns the same JSON shape.

   Also relaxed `Verqo.Infrastructure.csproj`'s and `Verqo.Api.csproj`'s
   EF Core/Npgsql/JwtBearer/HealthChecks.NpgSql package versions from
   exact pins (`8.0.10`) to floating `8.0.*`, so a first real restore
   can't fail on a guessed patch version that doesn't exist.

   After these fixes: all 3 currently-buildable projects
   (`Verqo.Domain`, `Verqo.Application`, `Verqo.OfflineSmokeTests`) still
   build clean and the 38/38 smoke-test assertions still pass — confirming
   the fixes introduced no regression. The remaining build failures for
   `Verqo.Infrastructure`/`Verqo.Api`/`Verqo.Application.Tests` in this
   sandbox are 100% `NU1100` restore errors (network), not code errors.

### 7.2 Getting the Flutter app actually building

The same shape of problem as §7.1, for a different set of blocked hosts.
Confirmed directly from this sandbox: `git clone` of the Flutter SDK itself
from `github.com/flutter/flutter` **works** (237 MB, no errors), but
running `flutter --version` from that clone fails immediately — its first
run downloads a Dart SDK snapshot from `storage.googleapis.com`, which is
blocked (`CONNECT tunnel failed, response 403`). `pub.dev` (needed for
`flutter pub get`) and `dl.google.com`/`maven.google.com` (needed for the
Android Gradle Plugin and AndroidX) are blocked the same way. So even a
manually-obtained Flutter SDK couldn't get past the first command here —
this isn't a workaround-able gap, the toolchain genuinely cannot run in
this sandbox.

**`.github/workflows/flutter.yml`** is the real build: checkout →
`subosito/flutter-action@v2` (stable channel, unrestricted network) →
`flutter create --platforms=android .` (generates `android/` fresh every
run — see `mobile/verqo_mobile/README.md` for why that folder isn't
committed) → `flutter pub get` → `flutter analyze` → `flutter test` →
`flutter build apk --release`, uploading the APK as a workflow artifact.
Fires on every push/PR touching `mobile/**`, same trigger shape as
`dotnet.yml`.

Compensated with a manual review pass, since nothing here could be
analyzed or run. It caught one real cross-layer bug: `JobsController.List`
(`Verqo.Api`) was projecting `Job.Channel` — an `EngagementChannel` enum —
without a `.ToString()`. No `JsonStringEnumConverter` is registered for
this API, so System.Text.Json's default would have serialized it as a raw
integer (`0`/`1`) rather than `"B2B"`/`"B2C"`, silently breaking any client
parsing it as a string (this app's `JobSummary.channel`, and in principle
the Angular jobs page too) — `FreelancersController` and `ClientsController`
already convert their own enum-backed fields with `.ToString()`; `JobsController`
just hadn't been brought in line. Fixed as part of this pass.

## 8. Kubernetes / containers

```
deploy/helm/verqo/
  Chart.yaml, values.yaml
  templates/
    namespace.yaml
    api-configmap.yaml
    api-deployment.yaml   Deployment + Service + HPA for Verqo.Api
    web-deployment.yaml   Deployment + Service + HPA for the Angular app (served via Nginx)
    ingress.yaml          host-based routing, cert-manager annotation for TLS
  examples/secrets-example.yaml   documents the two Secrets the chart expects (not applied by Helm)
```

Both images are multi-stage Dockerfiles (`backend/src/Verqo.Api/Dockerfile`,
`frontend-web/verqo-web/Dockerfile`) producing minimal runtime images that
run as non-root. Probes: `/healthz` (liveness) and `/readyz` (readiness,
checks the Postgres connection via `AspNetCore.HealthChecks.NpgSql`) on the
API; `/healthz` on the Nginx-served web app. HPA on both, CPU-target based,
sane defaults (API: 2-8 replicas, web: 2-6). No in-cluster database — see
§6 for why, and `deploy/helm/verqo/README.md` for the install command and
the Secrets you need to create first.

This is written to be cloud-portable (any GKE/EKS/AKS cluster; the only
cloud-specific pieces are the Ingress controller/cert-manager choice and
which managed Postgres product backs `verqo-db-credentials`), consistent
with the brief's "running in cloud" rather than naming one provider. Given
the original business plan's stated GCP target (Cloud Spanner, Memorystore,
GCS, Secret Manager), GKE + Cloud SQL for PostgreSQL is the reference
deployment this chart was written against, but nothing here hard-codes it.

## 9. Payments & escrow — v2a, unchanged in shape

Per the brief, dummy payment gateway and escrow account integration only.
`IPaymentGatewayAdapter` / `MockPaymentGatewayAdapter`
(`Verqo.Application/Payments/`) are a direct, faithful port of the original
TypeScript gateway abstraction — same three operations
(`CollectIntoEscrowAsync`, `ReleaseFromEscrowAsync`, `RefundFromEscrowAsync`),
same "always succeeds" mock behaviour for exercising the ledger/state
machine, same explicit note that this is not a substitute for a real
gateway pilot before launch. No new work was needed here beyond the
straight C# port — the abstraction already anticipated exactly this
"defer the real integration" scope.

## 10. Open decisions for whoever picks this up next

1. **KYC vendor** for PAN/Aadhaar/EPF (§5) — this is the same class of
   decision the payment gateway already was; needs a legal/commercial
   process (AUA/KUA authorisation or an aggregator relationship), not
   engineering.
2. **Cloud provider** — this rebuild stays portable and doesn't force GCP,
   but the managed-Postgres product, Ingress controller and image registry
   in `values.yaml` need real values for whichever cloud is chosen.
3. **Payment gateway** for v2b (Razorpay vs. Cashfree) — unchanged open
   decision from the original business plan.
4. **Password hashing** — `Verqo.Api.Controllers.PasswordHasher` is a
   placeholder (plain SHA-256, explicitly flagged in its own doc comment as
   not secure) so the registration endpoint compiles and is runnable
   end-to-end; replace with ASP.NET Core Identity's `PasswordHasher<T>` (or
   Argon2id) before this touches real user data.
5. **Client-side signup, contracts, milestones, messaging, disputes API
   endpoints** — the domain model and DB schema cover all of these
   (§1), but this rebuild's engineering effort concentrated on the new
   PAN/Aadhaar/EPF requirement and the infrastructure/deployment layer per
   the brief; the remaining CRUD endpoints follow the same
   controller → Application-service → EF Core pattern `FreelancersController`
   and `JobsController` establish.
