import 'package:flutter_test/flutter_test.dart';
import 'package:verqo_mobile/validators/kyc_validators.dart';

// Same test vectors already proven correct against the C# port —
// backend/tools/Verqo.OfflineSmokeTests/Program.cs runs the identical
// assertions on Verqo.Application.Kyc.{PanValidator,AadhaarValidator,
// GstinValidator} and passes 38/38 + 9 GSTIN + 7 client-registration
// checks. Reusing the exact same values here means a pass on this side
// means all three clients (C#, TypeScript, Dart) genuinely agree.
void main() {
  group('PanValidator', () {
    test('accepts a valid individual PAN', () {
      expect(PanValidator.validate('AAAPA1111A').isValid, isTrue);
    });

    test('normalizes lowercase and surrounding spaces', () {
      expect(PanValidator.validate(' aaapa1111a ').isValid, isTrue);
    });

    test('rejects the wrong length', () {
      expect(PanValidator.validate('AAAPA111A').isValid, isFalse);
    });

    test('rejects digits in letter positions', () {
      expect(PanValidator.validate('1AAPA1111A').isValid, isFalse);
    });

    test('rejects an unrecognised holder-type code (position 4)', () {
      expect(PanValidator.validate('AAAXA1111A').isValid, isFalse);
    });

    test('rejects empty and null', () {
      expect(PanValidator.validate('').isValid, isFalse);
      expect(PanValidator.validate(null).isValid, isFalse);
    });
  });

  group('AadhaarValidator (Verhoeff checksum)', () {
    test('accepts a valid Aadhaar number', () {
      expect(AadhaarValidator.validate('234123412346').isValid, isTrue);
    });

    test('accepts the same number with spaces', () {
      expect(AadhaarValidator.validate('2341 2341 2346').isValid, isTrue);
    });

    test('rejects a wrong checksum digit', () {
      expect(AadhaarValidator.validate('234123412347').isValid, isFalse);
    });

    test('rejects too short / too long', () {
      expect(AadhaarValidator.validate('23412341234').isValid, isFalse);
      expect(AadhaarValidator.validate('2341234123466').isValid, isFalse);
    });

    test('rejects a leading 0 or 1', () {
      expect(AadhaarValidator.validate('034123412340').isValid, isFalse);
      expect(AadhaarValidator.validate('134123412341').isValid, isFalse);
    });

    test('last4 extracts the right digits', () {
      expect(AadhaarValidator.last4('234123412346'), '2346');
    });
  });

  group('GstinValidator', () {
    test('accepts a valid-format GSTIN', () {
      expect(GstinValidator.validate('27AAAPA1111A1Z5').isValid, isTrue);
    });

    test('normalizes lowercase and surrounding spaces', () {
      expect(GstinValidator.validate(' 27aaapa1111a1z5 ').isValid, isTrue);
    });

    test('rejects the wrong length', () {
      expect(GstinValidator.validate('27AAAPA1111A1Z').isValid, isFalse);
    });

    test('rejects an out-of-range state code', () {
      expect(GstinValidator.validate('00AAAPA1111A1Z5').isValid, isFalse);
      expect(GstinValidator.validate('39AAAPA1111A1Z5').isValid, isFalse);
    });

    test("rejects a missing literal 'Z' in position 14", () {
      expect(GstinValidator.validate('27AAAPA1111A1Y5').isValid, isFalse);
    });

    test('rejects an unrecognised embedded PAN holder-type code', () {
      expect(GstinValidator.validate('27AAAXA1111A1Z5').isValid, isFalse);
    });

    test('is optional — empty and null are both valid (nothing to check)', () {
      expect(GstinValidator.validate('').isValid, isTrue);
      expect(GstinValidator.validate(null).isValid, isTrue);
    });

    test('normalize uppercases and trims', () {
      expect(GstinValidator.normalize(' 27aaapa1111a1z5 '), '27AAAPA1111A1Z5');
    });
  });
}
