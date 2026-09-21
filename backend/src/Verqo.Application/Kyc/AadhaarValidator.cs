using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Verqo.Application.Kyc;

/// <summary>
/// Offline Aadhaar validation: 12-digit format (first digit 2-9, per UIDAI's
/// numbering scheme) plus the Verhoeff checksum digit UIDAI uses for Aadhaar
/// numbers. The Verhoeff algorithm (Jacobus Verhoeff, 1969) is public-domain
/// arithmetic — implementing and running it locally is legitimate and needs
/// no external access, so it genuinely catches typos/invalid numbers today.
///
/// It does NOT confirm the Aadhaar number belongs to the person registering,
/// or that it's active in UIDAI's database — that needs UIDAI's Aadhaar
/// Paperless Offline e-KYC / e-KYC "Yes/No" API, which requires AUA/KUA
/// authorisation (or a licensed aggregator such as an authorised e-KYC
/// vendor). That call belongs behind <see cref="IKycVerificationService"/>.
///
/// Full Aadhaar numbers must never be persisted (Aadhaar Act, 2016 s.29 /
/// UIDAI storage restrictions) — see FreelancerProfile's remarks. This class
/// also provides <see cref="Last4"/> and <see cref="Hash"/> helpers so
/// callers never need to hold onto the full number past validation time.
/// </summary>
public static partial class AadhaarValidator
{
    [GeneratedRegex(@"^[2-9][0-9]{11}$")]
    private static partial Regex FormatRegex();

    private static readonly int[,] D =
    {
        {0,1,2,3,4,5,6,7,8,9},
        {1,2,3,4,0,6,7,8,9,5},
        {2,3,4,0,1,7,8,9,5,6},
        {3,4,0,1,2,8,9,5,6,7},
        {4,0,1,2,3,9,5,6,7,8},
        {5,9,8,7,6,0,4,3,2,1},
        {6,5,9,8,7,1,0,4,3,2},
        {7,6,5,9,8,2,1,0,4,3},
        {8,7,6,5,9,3,2,1,0,4},
        {9,8,7,6,5,4,3,2,1,0},
    };

    private static readonly int[,] P =
    {
        {0,1,2,3,4,5,6,7,8,9},
        {1,5,7,6,2,8,3,0,9,4},
        {5,8,0,3,7,9,6,1,4,2},
        {8,9,1,6,0,4,3,5,2,7},
        {9,4,5,3,1,2,6,8,7,0},
        {4,2,8,6,5,7,3,9,0,1},
        {2,7,9,3,8,0,6,4,1,5},
        {7,0,4,6,9,1,3,2,5,8},
    };

    private static bool VerhoeffChecksumIsValid(string digits)
    {
        var c = 0;
        for (var i = 0; i < digits.Length; i++)
        {
            var digit = digits[digits.Length - 1 - i] - '0';
            c = D[c, P[i % 8, digit]];
        }
        return c == 0;
    }

    public static ValidationOutcome Validate(string? aadhaar)
    {
        if (string.IsNullOrWhiteSpace(aadhaar))
        {
            return ValidationOutcome.Invalid("Aadhaar number is required.");
        }

        var normalized = aadhaar.Replace(" ", "").Trim();

        if (!FormatRegex().IsMatch(normalized))
        {
            return ValidationOutcome.Invalid("Aadhaar must be exactly 12 digits and cannot start with 0 or 1.");
        }

        if (!VerhoeffChecksumIsValid(normalized))
        {
            return ValidationOutcome.Invalid("Aadhaar number failed checksum validation — check for a typo.");
        }

        return ValidationOutcome.Valid;
    }

    public static string Normalize(string aadhaar) => aadhaar.Replace(" ", "").Trim();

    public static string Last4(string validatedAadhaar) => validatedAadhaar[^4..];

    /// <summary>
    /// Salted SHA-256 hash for duplicate-account detection without storing
    /// the full number. <paramref name="pepper"/> is an app-wide secret
    /// (from configuration/secret manager), not a per-user salt — Aadhaar
    /// has no per-user salt to draw on since it must never be stored.
    /// </summary>
    public static string Hash(string validatedAadhaar, string pepper)
    {
        var bytes = Encoding.UTF8.GetBytes(pepper + ":" + validatedAadhaar);
        return Convert.ToHexString(SHA256.HashData(bytes));
    }
}
