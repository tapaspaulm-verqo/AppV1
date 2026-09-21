import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Verqo brand tokens — same values as the Angular web app's styles.css and
/// the original Next.js scaffold's globals.css, so all three clients render
/// as one consistent brand.
class VerqoColors {
  static const black = Color(0xFF0A0A0A);
  static const silver = Color(0xFF9AA0A6);
  static const silverLight = Color(0xFFE8EAED);
  static const white = Color(0xFFFFFFFF);
  static const success = Color(0xFF1B7F4D);
  static const danger = Color(0xFFB3261E);
}

class VerqoTheme {
  static ThemeData light() {
    final headingStyle = GoogleFonts.ibmPlexSans(fontWeight: FontWeight.w700);
    final bodyStyle = GoogleFonts.inter();

    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: VerqoColors.white,
      colorScheme: ColorScheme.fromSeed(
        seedColor: VerqoColors.black,
        primary: VerqoColors.black,
        secondary: VerqoColors.success,
        error: VerqoColors.danger,
        surface: VerqoColors.white,
      ),
      textTheme: GoogleFonts.interTextTheme().copyWith(
        headlineLarge: headingStyle.copyWith(fontSize: 32),
        headlineMedium: headingStyle.copyWith(fontSize: 24),
        titleLarge: headingStyle.copyWith(fontSize: 18),
        bodyMedium: bodyStyle.copyWith(fontSize: 15, color: VerqoColors.black),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: VerqoColors.black,
          foregroundColor: VerqoColors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          textStyle: bodyStyle.copyWith(fontWeight: FontWeight.w600),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: VerqoColors.silverLight),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      ),
    );
  }
}
