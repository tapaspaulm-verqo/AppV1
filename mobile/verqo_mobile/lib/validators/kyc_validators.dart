/// Client-side PAN/Aadhaar checks — the third mirror of the same logic that
/// lives in Verqo.Application.Kyc (C#) and the Angular app's
/// core/validators/*.ts. All three implement the identical public-domain
/// Verhoeff algorithm and PAN structure rules, so every client gives the
/// same instant feedback; the .NET API is still the source of truth and the
/// only place a real KYC vendor call can eventually be made.
library;

class ValidationOutcome {
  final bool isValid;
  final String? reason;
  const ValidationOutcome(this.isValid, [this.reason]);
}

class PanValidator {
  static final _format = RegExp(r'^[A-Z]{5}[0-9]{4}[A-Z]$');
  static const _validHolderTypeCodes = {'P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T'};

  static ValidationOutcome validate(String? pan) {
    if (pan == null || pan.trim().isEmpty) {
      return const ValidationOutcome(false, 'PAN is required.');
    }
    final normalized = pan.trim().toUpperCase();
    if (!_format.hasMatch(normalized)) {
      return const ValidationOutcome(
          false, 'PAN must be in the format AAAAA9999A (5 letters, 4 digits, 1 letter).');
    }
    if (!_validHolderTypeCodes.contains(normalized[3])) {
      return ValidationOutcome(false, "'${normalized[3]}' in position 4 is not a recognised PAN holder-type code.");
    }
    return const ValidationOutcome(true);
  }

  static String normalize(String pan) => pan.trim().toUpperCase();
}

class AadhaarValidator {
  static final _format = RegExp(r'^[2-9][0-9]{11}$');

  static const List<List<int>> _d = [
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

  static const List<List<int>> _p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  static bool _verhoeffIsValid(String digits) {
    var c = 0;
    for (var i = 0; i < digits.length; i++) {
      final digit = int.parse(digits[digits.length - 1 - i]);
      c = _d[c][_p[i % 8][digit]];
    }
    return c == 0;
  }

  static ValidationOutcome validate(String? aadhaar) {
    if (aadhaar == null || aadhaar.trim().isEmpty) {
      return const ValidationOutcome(false, 'Aadhaar number is required.');
    }
    final normalized = aadhaar.replaceAll(' ', '').trim();
    if (!_format.hasMatch(normalized)) {
      return const ValidationOutcome(false, 'Aadhaar must be exactly 12 digits and cannot start with 0 or 1.');
    }
    if (!_verhoeffIsValid(normalized)) {
      return const ValidationOutcome(false, 'Aadhaar number failed checksum validation — check for a typo.');
    }
    return const ValidationOutcome(true);
  }

  static String last4(String validatedAadhaar) => validatedAadhaar.substring(validatedAadhaar.length - 4);
}
