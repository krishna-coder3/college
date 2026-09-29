import 'package:flutter/material.dart';

class AppTheme {
  // Brand Academic Palette inspired by KM University Crest
  static const Color primaryRoyalNavy = Color(0xFF1E3A8A);
  static const Color primaryCobalt = Color(0xFF1D4ED8);
  static const Color secondaryCyan = Color(0xFF0284C7);
  static const Color accentGold = Color(0xFFD97706);
  static const Color surfaceWarmWhite = Color(0xFFF8FAFC);
  static const Color darkCardSurface = Color(0xFF0F172A);

  // Status & SLA Indicators
  static const Color statusSuccess = Color(0xFF10B981);
  static const Color statusWarning = Color(0xFFF59E0B);
  static const Color statusDanger = Color(0xFFEF4444);
  static const Color statusInfo = Color(0xFF3B82F6);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primaryRoyalNavy,
      primary: primaryRoyalNavy,
      secondary: secondaryCyan,
      tertiary: accentGold,
      surface: surfaceWarmWhite,
    ),
    scaffoldBackgroundColor: surfaceWarmWhite,
    cardTheme: CardTheme(
      color: Colors.white,
      elevation: 1.5,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: primaryRoyalNavy,
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: false,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFF60A5FA),
      secondary: Color(0xFF38BDF8),
      tertiary: Color(0xFFFBBF24),
      surface: darkCardSurface,
    ),
    scaffoldBackgroundColor: const Color(0xFF020617),
    cardTheme: CardTheme(
      color: darkCardSurface,
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
        side: const BorderSide(color: Color(0xFF1E293B)),
      ),
    ),
  );
}
