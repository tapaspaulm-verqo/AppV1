using System.Text.RegularExpressions;

namespace Verqo.Application.Kyc;

public record ValidationOutcome(bool IsValid, string? Reason = null)
{
    public static readonly ValidationOutcome Valid = new(true);
    public static ValidationOutcome Invalid(string reason) => new(false, reason);
}

/// <summary>
/// Offline PAN (Permanent Account Number) structural validation — what can
/// legitimately be checked without calling anyone. PAN has no public
/// checksum digit (unlike Aadhaar), so this validates format and the
/// documented holder-type code in position 4. It does NOT confirm the PAN
/// is real/active/matches the holder's name — that needs the Income Tax
/// Department's "Verify PAN" API (via NSDL/Protean e-Gov or the e-Filing
/// portal's API), which requires a registered-entity agreement. That call
/// belongs behind <see cref="IKycVerificationService"/>, not here.
/// </summary>
public static partial class PanValidator
{
    // AAAAA9999A: 5 letters, 4 digits, 1 letter.
    [GeneratedRegex("^[A-Z]{5}[0-9]{4}[A-Z]$")]
    private static partial Regex FormatRegex();

    // 4th character encodes the holder type (CBDT-documented, public).
    private static readonly HashSet<char> ValidHolderTypeCodes =
        ['P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T'];

    public static ValidationOutcome Validate(string? pan)
    {
        if (string.IsNullOrWhiteSpace(pan))
        {
            return ValidationOutcome.Invalid("PAN is required.");
        }

        var normalized = pan.Trim().ToUpperInvariant();

        if (!FormatRegex().IsMatch(normalized))
        {
            return ValidationOutcome.Invalid("PAN must be in the format AAAAA9999A (5 letters, 4 digits, 1 letter).");
        }

        if (!ValidHolderTypeCodes.Contains(normalized[3]))
        {
            return ValidationOutcome.Invalid($"'{normalized[3]}' in position 4 is not a recognised PAN holder-type code.");
        }

        return ValidationOutcome.Valid;
    }

    public static string Normalize(string pan) => pan.Trim().ToUpperInvariant();
}
