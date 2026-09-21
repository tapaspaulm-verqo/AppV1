# Verqo v2 — .NET / Angular / Flutter rebuild

Start with **`docs/ARCHITECTURE.md`** — it explains every decision here
(why PostgreSQL over Spanner, why Flutter over MAUI, what's real vs. mocked
in the PAN/Aadhaar/EPF checks, and exactly what did and didn't build inside
the sandbox that produced this scaffold).

```
verqo-dotnet/
  docs/ARCHITECTURE.md      read this first
  backend/                  ASP.NET Core 8 API (Clean Architecture) + EF Core/Npgsql
  frontend-web/verqo-web/   Angular 18 web app
  mobile/verqo_mobile/      Flutter app (Android + iOS)
  deploy/helm/verqo/        Kubernetes Helm chart
```

## Quickest way to see real, working logic right now

No installs needed beyond the .NET SDK (already present if you're reading
this from the delivered zip on a normal machine):

```
cd backend
dotnet run --project tools/Verqo.OfflineSmokeTests
```

This runs the PAN validator, the Aadhaar Verhoeff-checksum validator, the
fee calculator, the milestone state machine, and an end-to-end mock
freelancer registration — 38 assertions, all passing. It's the fastest way
to confirm the new PAN/Aadhaar/EPF logic actually works before diving into
the rest of the codebase.

## Running each piece for real

- **Backend API**: `cd backend && dotnet restore && dotnet run --project src/Verqo.Api`
  (needs NuGet access — delete/edit `backend/NuGet.Config` first if it's
  still pointed at "no sources" from the build sandbox).
- **Web**: `cd frontend-web/verqo-web && npm install && npm start` (already
  verified to build cleanly — see ARCHITECTURE.md §7).
- **Mobile**: `cd mobile/verqo_mobile && flutter create . && flutter pub get && flutter run`.
- **Kubernetes**: `helm lint deploy/helm/verqo` then see
  `deploy/helm/verqo/README.md`.
