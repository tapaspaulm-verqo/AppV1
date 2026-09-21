# Verqo mobile (Flutter)

Single Flutter codebase for Android and iOS, consuming the same .NET Web API
(`Verqo.Api`) the Angular web app calls. See `docs/ARCHITECTURE.md` at the
repo root for why Flutter was chosen over .NET MAUI or React Native.

## Status

Source-complete for the three flows the backend actually supports today —
freelancer registration, client registration, and browsing open roles — not
built-and-verified on a device here. The Flutter SDK could not be installed
in the sandbox that produced (and later expanded) this scaffold: its
download host, `storage.googleapis.com`, along with `pub.dev` (package
resolution) and `dl.google.com`/`maven.google.com` (Android Gradle Plugin
and AndroidX), are all blocked by that sandbox's network egress policy —
confirmed by probing each host directly, not a transient failure. (`git
clone` of the Flutter SDK itself from GitHub does work there, for what it's
worth — it's specifically Google's own asset-hosting domains that are
unreachable.)

**`.github/workflows/flutter.yml` is where this actually gets built.** A
normal GitHub Actions runner has unrestricted network access, so that
workflow installs a real Flutter SDK, runs `flutter create --platforms=android .`
to generate the `android/` platform folder (not committed here — see
below), then `flutter analyze`, `flutter test`, and `flutter build apk
--release`, uploading the APK as a build artifact. Push this repo (or open
a PR touching `mobile/**`) and check the Actions tab — same pattern
`.github/workflows/dotnet.yml` already uses for the NuGet-blocked backend
projects.

### Why `android/` and `ios/` aren't committed

Flutter-generated platform folders include binary files (the Gradle
wrapper jar, for one) alongside boilerplate Gradle/Xcode config. This
project has no custom native code yet — no custom permissions, no native
plugins needing manual wiring, nothing that would make a hand-maintained
platform folder worth the risk of committing something unverifiable. Since
`flutter create` can't be run in the sandbox that wrote this code, hand-
authoring those files by hand would mean committing native build
configuration nobody could confirm actually builds. `flutter create .`
regenerates them fresh and deterministically instead — the CI workflow
does this automatically, and you should too:

```
flutter create --platforms=android,ios .
flutter pub get
flutter run
```

If this project later needs custom native config (a permission, a native
plugin's manual setup step), commit `android/`/`ios/` at that point and
drop the `flutter create` step from CI in favour of the checked-in folders.

## What's here

- `lib/main.dart` — app entry point; home is `RootShell`.
- `lib/screens/root_shell.dart` — bottom nav (Home / Find work). Signup is
  reached from Home's two CTAs, not its own tab — mirroring how the web app
  treats signup as a destination, not a persistent nav item.
- `lib/theme/verqo_theme.dart` — brand tokens (ink/accent-green/client-plum,
  IBM Plex Sans + Inter via `google_fonts`) — identical hex values to the
  Angular app's `styles.css` and the "Verqo Brand Identity & Design System
  v1" source doc, so all three clients render as one brand.
- `lib/services/api_client.dart` — thin HTTP client for `Verqo.Api`:
  freelancer registration, client registration, open-jobs listing, and a
  shared helper that flattens the API's `ValidationProblemDetails` error
  shape into one readable string.
- `lib/validators/kyc_validators.dart` — PAN format, Aadhaar Verhoeff
  checksum, and GSTIN structural checks — line-for-line ports of the same
  logic in `Verqo.Application.Kyc` (C#) and the Angular app's
  `core/validators/*.ts`, so all three clients give identical instant
  feedback. The API is still the source of truth.
- `lib/screens/home_screen.dart` — hero copy plus both signup CTAs.
- `lib/screens/freelancer_signup_screen.dart` — wired to
  `POST /freelancers/register` (PAN/Aadhaar/EPF UAN).
- `lib/screens/client_signup_screen.dart` — wired to
  `POST /clients/register` (company name + optional GSTIN).
- `lib/screens/jobs_screen.dart` — read-only open-roles list from
  `GET /jobs`. Proposals/contracts aren't wired up on any client yet (see
  `docs/ARCHITECTURE.md` §10, item 5).
- `test/validators/kyc_validators_test.dart` — unit tests using the exact
  same test vectors already proven correct against the C# port (see
  `backend/tools/Verqo.OfflineSmokeTests`, 38/38 + 9 GSTIN + 7 client
  checks passing there).
- `test/widget_test.dart` — smoke tests for navigation and both signup
  forms opening correctly.

### A real bug this pass caught

`JobsController.List` was serializing `Job.Channel` (an `EngagementChannel`
enum) without converting it to a string first. With no
`JsonStringEnumConverter` registered for this API, ASP.NET Core's default
JSON serializer would have sent that field as a raw integer (`0`/`1`)
instead of `"B2B"`/`"B2C"` — silently breaking any client parsing it as a
string, including this app's `JobSummary.channel` and, in principle, the
Angular jobs page too. Fixed to `Channel = j.Channel.ToString()`, matching
how `FreelancersController` and `ClientsController` already handle their
own enum-backed fields.

## Configuring the API URL

```
flutter run --dart-define=API_BASE_URL=https://api.verqo.example.com/api/v1
```

Defaults to `http://10.0.2.2:8080/api/v1` (the Android emulator's alias for
the host machine's `localhost:8080`, where `Verqo.Api` runs locally).

## Known follow-ups (not done in this pass)

- The signup screens' legal-note lines ("Terms of Use, Privacy Policy and
  Freelancer/Client Agreement") are plain, non-tappable text — the web
  app's equivalent links to `/legal/*` routes, but wiring that up here
  needs either `url_launcher` (a new dependency, plus an AndroidManifest
  `<queries>` entry that only makes sense once `android/` is a real,
  committed folder) or an in-app legal-docs screen. Worth doing properly
  before a Play Store submission, since this app collects PAN/Aadhaar.
- No login/session screens — the backend has no login endpoint yet either
  (see `docs/ARCHITECTURE.md` §10, item 5).
- No app icon/launcher assets — `flutter create`'s defaults apply until
  real brand assets (the Vertex mark) are supplied.
- Dark theme isn't wired up, even though every color token above has its
  dark-mode hex recorded in `verqo_theme.dart`'s doc comments.
