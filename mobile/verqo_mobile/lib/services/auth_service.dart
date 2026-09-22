import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_client.dart';

/// Holds the logged-in session (JWT + the current user) and persists it to
/// device storage so a Freelancer or Client stays logged in across app
/// restarts — the mobile equivalent of the Angular web app's
/// `core/services/auth.service.ts` (which does the same thing with
/// localStorage). A single app-wide instance (`AuthService.instance`)
/// rather than a package like `provider`, to keep this scaffold's
/// dependency footprint the same as the rest of lib/ (see api_client.dart's
/// own no-`intl` note) — widgets that care about auth state rebuild via
/// `AnimatedBuilder(animation: AuthService.instance, ...)`.
class AuthService extends ChangeNotifier {
  AuthService._();
  static final AuthService instance = AuthService._();

  static const _tokenKey = 'verqo.session.token';
  static const _expiresAtKey = 'verqo.session.expiresAt';
  static const _userKey = 'verqo.session.user';

  String? _token;
  SessionUser? _user;
  bool _restoring = true;

  String? get token => _token;
  SessionUser? get user => _user;
  bool get isLoggedIn => _token != null && _user != null;

  /// True until the stored session (if any) has been read back from disk —
  /// callers that gate UI on login state should wait for this to flip to
  /// false first, so a logged-in user doesn't flash a "log in" screen on
  /// cold start.
  bool get isRestoring => _restoring;

  Future<void> restoreSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(_tokenKey);
      final expiresAtRaw = prefs.getString(_expiresAtKey);
      final userRaw = prefs.getString(_userKey);
      final expiresAt = expiresAtRaw != null ? DateTime.tryParse(expiresAtRaw) : null;

      if (token != null && userRaw != null && expiresAt != null && expiresAt.isAfter(DateTime.now())) {
        _token = token;
        _user = SessionUser.fromJson(jsonDecode(userRaw) as Map<String, dynamic>);
      } else {
        await prefs.remove(_tokenKey);
        await prefs.remove(_expiresAtKey);
        await prefs.remove(_userKey);
      }
    } catch (_) {
      // Corrupt or unreadable local storage — treat as logged out rather
      // than crashing app start.
    } finally {
      _restoring = false;
      notifyListeners();
    }
  }

  Future<void> setSession(LoginResponse response) async {
    _token = response.token;
    _user = response.user;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, response.token);
      await prefs.setString(_expiresAtKey, response.expiresAt);
      await prefs.setString(_userKey, jsonEncode(response.user.toJson()));
    } catch (_) {
      // Session still works for the rest of this app run even if it
      // couldn't be persisted — just won't survive a restart.
    }
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_tokenKey);
      await prefs.remove(_expiresAtKey);
      await prefs.remove(_userKey);
    } catch (_) {
      // Nothing left to clean up if storage itself is unavailable.
    }
  }
}
