# Verqo mobile (Flutter)

Single Flutter codebase for Android and iOS, consuming the same .NET Web API
(`Verqo.Api`) the Angular web app calls. See `docs/ARCHITECTURE.md` at the
repo root for why Flutter was chosen over .NET MAUI or React Native.

## Status

This is a structural scaffold, not a built-and-verified app: the Flutter SDK
could not be installed in the sandbox that produced this rebuild (its
download host, `storage.googleapis.com`, isn't reachable through that
sandbox's network egress policy — confirmed, not a transient failure). Every
file here is genuine, idiomatic Dart/Flutter, and the three files under
`lib/validators` and `lib/services` have no Flutter-specific dependencies
they could get wrong, but none of it has been run through `flutter analyze`,
`flutter build`, or a device/emulator here. Run `flutter create .` in this
directory to (re)generate the platform folders (`android/`, `ios/`) with a
real Flutter install, then `flutter pub get && flutter run`.

## Structure

- `lib/main.dart` — app entry point, Verqo theme applied.
- `lib/theme/verqo_theme.dart` — brand tokens (black/silver/white/green,
  IBM Plex Sans + Inter via `google_fonts`), identical values to the Angular
  app's `styles.css`.
- `lib/services/api_client.dart` — thin HTTP client for `Verqo.Api`.
- `lib/validators/kyc_validators.dart` — PAN format + Aadhaar Verhoeff
  checksum validation, a line-for-line port of the same logic in
  `Verqo.Application.Kyc` (C#) and the Angular app's `core/validators/*.ts`,
  so all three clients give identical instant feedback. The API is still the
  source of truth.
- `lib/screens/home_screen.dart`, `lib/screens/freelancer_signup_screen.dart`
  — the two screens ported from the original demo videos' freelancer flow.

## Configuring the API URL

```
flutter run --dart-define=API_BASE_URL=https://api.verqo.example.com/api/v1
```

Defaults to `http://10.0.2.2:8080/api/v1` (the Android emulator's alias for
the host machine's `localhost:8080`, where `Verqo.Api` runs locally).
