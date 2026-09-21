using System.Text.RegularExpressions;

namespace Verqo.Application.Kyc;

/// <summary>
/// Offline GSTIN (Goods and Services Tax Identification Number) structural
/// validation, in the same spirit as <see cref="PanValidator"/>: what can
/// legitimately be checked without calling anyone. A GSTIN is 15 characters
/// — a 2-digit state code, the business's 10-character PAN, a 1-character
/// entity/registration number, the literal 'Z', and a final alphanumeric
/// check-digit computed with a public mod-36 algorithm.
///
/// This validates the state code range and the embedded PAN's format (the
/// same structural check <see cref="PanValidator"/> applies), but
/// deliberately does NOT recompute the mod-36 check digit — unlike
/// Aadhaar's Verhoeff digit, getting that arithmetic subtly wrong would
/// silently reject valid GSTINs, and GSTIN is optional at Client
/// registration (Clause 3.1 of the draft Client Agreement: full business
/// verification, including GST registration, happens before a Client can
/// fund a Milestone, not as a registration gate). It also does NOT confirm
/// the GSTIN is active or matches the registering business — that needs
/// the GST Network's "Search Taxpayer" API, which belongs behind a real
/// verification integration, not here.
/// </summary>
public static partial class GstinValidator
{
    // 2 digits (state code) + PAN (5 letters, 4 digits, 1 letter) +
    // 1 entity-number char + literal 'Z' + 1 check-digit char.
    [GeneratedRegex("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$")]
    private static partial Regex FormatRegex();

    public static ValidationOutcome Validate(string? gstin)
    {
        if (string.IsNullOrWhiteSpace(gstin))
        {
            return ValidationOutcome.Invalid("GSTIN is required.");
        }

        var normalized = gstin.Trim().ToUpperInvariant();

        if (!FormatRegex().IsMatch(normalized))
        {
            return ValidationOutcome.Invalid(
                "GSTIN must be 15 characters: a 2-digit state code, the business's 10-character PAN, an entity number, 'Z', and a check digit.");
        }

        var stateCode = int.Parse(normalized[..2]);
        if (stateCode is < 1 or > 38)
        {
            return ValidationOutcome.Invalid("The first two digits of a GSTIN must be a valid state code (01–38).");
        }

        var embeddedPan = PanValidator.Validate(normalized.Substring(2, 10));
        if (!embeddedPan.IsValid)
        {
            return ValidationOutcome.Invalid("The PAN embedded in the GSTIN (characters 3–12) is not validly formatted.");
        }

        return ValidationOutcome.Valid;
    }

    public static string Normalize(string gstin) => gstin.Trim().ToUpperInvariant();
}
