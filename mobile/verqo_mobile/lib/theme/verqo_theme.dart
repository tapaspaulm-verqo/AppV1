import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Verqo brand tokens — identical values to the Angular web app's
/// `src/styles.css` (:root custom properties) and the source-of-truth
/// "Verqo Brand Identity & Design System v1", so web, Android and iOS
/// render as one consistent brand. Only the light-theme values are wired
/// into a ThemeData below (dark mode isn't built yet); the dark-theme hex
/// is recorded in each doc comment so it's a one-line change to add later.
class VerqoColors {
  /// Primary text/icons. Dark-theme value: 0xFFF3F1EC.
  static const ink = Color(0xFF14130F);

  /// Secondary text, captions, timestamps. Dark-theme value: 0xFFB8B3A8.
  static const inkSecondary = Color(0xFF56524B);

  /// Page background. Dark-theme value: 0xFF121110.
  static const surface100 = Color(0xFFFFFFFF);

  /// Card/panel/input background. Dark-theme value: 0xFF1B1A17.
  static const surface200 = Color(0xFFF7F6F3);

  /// Tertiary labels, placeholders. Dark-theme value: 0xFF7D7870.
  static const silver = Color(0xFF9C978D);

  /// Verified-green. Per the brand doc this is meant ONLY for verified
  /// badges, Funded/Released states and protected-money CTAs — but the
  /// web app has also established it, in practice, as the freelancer-role
  /// accent (`.btn-accent`, `.badge-freelancer`), so this mirrors that same
  /// shipped convention rather than the stricter written rule. Dark-theme
  /// value: 0xFF3F8F71.
  static const accent = Color(0xFF1F5C46);

  /// Plum — the client-role accent, mirroring the web app's `.btn-client` /
  /// `.badge-client` convention. Dark-theme value: 0xFF8862A8.
  static const client = Color(0xFF5B3E73);

  /// Orange — the smallest Vertex logo node only. Not used as a general UI
  /// color anywhere in this app, matching the web app. Dark-theme value:
  /// 0xFFFFAF7F.
  static const verqo = Color(0xFFB24300);

  /// Disputed / pending-review milestone states. Dark-theme value: 0xFFC99A3E.
  static const warning = Color(0xFF9A6B12);

  /// Failed payout, expired/cancelled contract. Dark-theme value: 0xFFC4574A.
  static const danger = Color(0xFFA13A2F);

  static const borderSubtle = surface200;
}

/// 4px base grid — same scale as the web app's `--space-*` tokens.
class VerqoSpacing {
  static const s1 = 4.0;
  static const s2 = 8.0;
  static const s3 = 12.0;
  static const s4 = 16.0;
  static const s5 = 20.0;
  static const s6 = 24.0;
  static const s8 = 32.0;
  static const s10 = 40.0;
  static const s12 = 48.0;
  static const s16 = 64.0;
}

/// Same scale as the web app's `--radius-*` tokens.
class VerqoRadius {
  static const sm = 6.0;
  static const md = 10.0;
  static const lg = 16.0;
  static const full = 999.0;
}

class VerqoTheme {
  static ThemeData light() {
    final headingStyle = GoogleFonts.ibmPlexSans(
      fontWeight: FontWeight.w600,
      color: VerqoColors.ink,
    );
    final bodyStyle = GoogleFonts.inter(color: VerqoColors.ink);

    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: VerqoColors.surface100,
      colorScheme: ColorScheme.fromSeed(
        seedColor: VerqoColors.accent,
        brightness: Brightness.light,
        primary: VerqoColors.ink,
        secondary: VerqoColors.accent,
        error: VerqoColors.danger,
        surface: VerqoColors.surface100,
      ),
      textTheme: GoogleFonts.interTextTheme().copyWith(
        displayLarge: headingStyle.copyWith(fontSize: 40, height: 1.15),
        headlineLarge: headingStyle.copyWith(fontSize: 32, height: 1.2),
        headlineMedium: headingStyle.copyWith(fontSize: 24, height: 1.25),
        titleLarge: headingStyle.copyWith(fontSize: 18),
        bodyMedium: bodyStyle.copyWith(fontSize: 15, height: 1.5),
        labelSmall: bodyStyle.copyWith(
          fontSize: 12,
          color: VerqoColors.inkSecondary,
          fontWeight: FontWeight.w600,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: VerqoColors.surface100,
        foregroundColor: VerqoColors.ink,
        elevation: 0,
        titleTextStyle: headingStyle.copyWith(fontSize: 18),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: VerqoColors.accent,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(VerqoRadius.sm),
          ),
          textStyle: bodyStyle.copyWith(fontWeight: FontWeight.w600, color: Colors.white),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: VerqoColors.ink,
          side: const BorderSide(color: VerqoColors.borderSubtle),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(VerqoRadius.sm),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: VerqoColors.surface100,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(VerqoRadius.sm),
          borderSide: const BorderSide(color: VerqoColors.borderSubtle),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: VerqoColors.surface100,
        selectedItemColor: VerqoColors.ink,
        unselectedItemColor: VerqoColors.silver,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }

  /// Client-role button style ("Hire talent", "Create client account") —
  /// plum instead of the default green, mirroring `.btn-client`. Apply with
  /// `ElevatedButton(style: VerqoTheme.clientButton(), ...)`.
  static ButtonStyle clientButton() => ElevatedButton.styleFrom(
        backgroundColor: VerqoColors.client,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(VerqoRadius.sm),
        ),
      );
}
