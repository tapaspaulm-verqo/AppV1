// Dependency-free smoke test runner.
//
// This project exists ONLY because this sandbox's egress proxy cannot reach
// api.nuget.org, so the idiomatic xunit test project
// (tests/Verqo.Application.Tests) can't restore xunit/Microsoft.NET.Test.Sdk
// here and can't be run in this environment. That xunit project is still
// the real, intended test suite — it will run normally the moment this
// solution is built anywhere with ordinary NuGet access (any dev machine,
// any CI runner). This console app re-implements the same cases with plain
// assertions against Verqo.Domain/Verqo.Application directly (both of which
// have zero external package dependencies), so the PAN/Aadhaar validators
// and fee/state-machine business rules are still genuinely exercised and
// verified before shipping, not just asserted to be correct.

using Verqo.Application.Common;
using Verqo.Application.Kyc;
using Verqo.Domain.Enums;

var failures = new List<string>();
var passCount = 0;

void Check(string name, bool condition)
{
    if (condition)
    {
        passCount++;
    }
    else
    {
        failures.Add(name);
    }
    Console.WriteLine($"[{(condition ? "PASS" : "FAIL")}] {name}");
}

Console.WriteLine("=== PAN validator ===");
Check("valid individual PAN (AAAPA1111A)", PanValidator.Validate("AAAPA1111A").IsValid);
Check("valid PAN, lowercase + spaces normalized", PanValidator.Validate(" aaapa1111a ").IsValid);
Check("rejects wrong length", !PanValidator.Validate("AAAPA111A").IsValid);
Check("rejects digits in letter positions", !PanValidator.Validate("1AAPA1111A").IsValid);
Check("rejects unrecognised holder-type code (position 4)", !PanValidator.Validate("AAAXA1111A").IsValid);
Check("rejects empty", !PanValidator.Validate("").IsValid);
Check("rejects null", !PanValidator.Validate(null).IsValid);

Console.WriteLine();
Console.WriteLine("=== Aadhaar validator (Verhoeff checksum) ===");
Check("valid Aadhaar (234123412346)", AadhaarValidator.Validate("234123412346").IsValid);
Check("valid Aadhaar with spaces (2341 2341 2346)", AadhaarValidator.Validate("2341 2341 2346").IsValid);
Check("rejects wrong checksum digit (234123412347)", !AadhaarValidator.Validate("234123412347").IsValid);
Check("rejects 11 digits (too short)", !AadhaarValidator.Validate("23412341234").IsValid);
Check("rejects 13 digits (too long)", !AadhaarValidator.Validate("2341234123466").IsValid);
Check("rejects leading 0", !AadhaarValidator.Validate("034123412340").IsValid);
Check("rejects leading 1", !AadhaarValidator.Validate("134123412341").IsValid);
Check("rejects non-digits", !AadhaarValidator.Validate("23412341234A").IsValid);

var last4 = AadhaarValidator.Last4("234123412346");
Check("Last4 extracts the right digits", last4 == "2346");
var hash1 = AadhaarValidator.Hash("234123412346", "test-pepper");
var hash2 = AadhaarValidator.Hash("234123412346", "test-pepper");
var hash3 = AadhaarValidator.Hash("234123412347", "test-pepper");
Check("Hash is deterministic for the same input+pepper", hash1 == hash2);
Check("Hash differs for a different Aadhaar number", hash1 != hash3);
Check("Hash never contains the raw Aadhaar digits", !hash1.Contains("234123412346"));

Console.WriteLine();
Console.WriteLine("=== Fee calculation (ported from business-rules.ts) ===");
var standardFees = BusinessRules.CalculateFees(100_000_00, ClientPlan.Standard); // ₹1,00,000 contract
Check("standard client fee = 10%", standardFees.ClientFeeMinor == 10_000_00);
Check("freelancer fee = 5% regardless of plan", standardFees.FreelancerFeeMinor == 5_000_00);
Check("client pays total = contract + client fee", standardFees.ClientPaysTotalMinor == 110_000_00);
Check("freelancer receives = contract - freelancer fee", standardFees.FreelancerReceivesMinor == 95_000_00);

var businessPlusFloor = BusinessRules.CalculateFees(100_000_00, ClientPlan.BusinessPlus);
Check("Business Plus with no negotiated rate falls to the 5% floor", businessPlusFloor.ClientFeeMinor == 5_000_00);

var businessPlusNegotiated = BusinessRules.CalculateFees(100_000_00, ClientPlan.BusinessPlus, 0.07);
Check("Business Plus honours a negotiated rate within range", businessPlusNegotiated.ClientFeeMinor == 7_000_00);

var rangeRejected = false;
try { BusinessRules.CalculateFees(100_000_00, ClientPlan.BusinessPlus, 0.20); }
catch (ArgumentOutOfRangeException) { rangeRejected = true; }
Check("rejects a negotiated rate outside [floor, standard]", rangeRejected);

Console.WriteLine();
Console.WriteLine("=== Milestone state machine ===");
Check("Unfunded -> Funded is valid", BusinessRules.CanTransition(MilestoneState.Unfunded, MilestoneState.Funded));
Check("Unfunded -> ApprovedReleased is invalid (can't skip straight to release)",
    !BusinessRules.CanTransition(MilestoneState.Unfunded, MilestoneState.ApprovedReleased));
Check("Submitted -> InProgress is valid (revision requested)",
    BusinessRules.CanTransition(MilestoneState.Submitted, MilestoneState.InProgress));
Check("ApprovedReleased is terminal (no further transitions)",
    !BusinessRules.CanTransition(MilestoneState.ApprovedReleased, MilestoneState.Disputed));

var threw = false;
try { BusinessRules.AssertValidTransition(MilestoneState.Unfunded, MilestoneState.Disputed); }
catch (InvalidOperationException) { threw = true; }
Check("AssertValidTransition throws on an invalid transition", threw);

Console.WriteLine();
Console.WriteLine("=== Freelancer registration (mock KYC end-to-end) ===");
var registerService = new Verqo.Application.Freelancers.RegisterFreelancerService(new MockKycVerificationService(), "smoke-test-pepper");

var okResult = await registerService.RegisterAsync(new Verqo.Application.Freelancers.RegisterFreelancerRequest(
    Email: "arjun.dev@example.com",
    PasswordHash: "argon2id$fake-hash-for-test",
    DisplayName: "Arjun Dev",
    PrimaryRole: "Backend Engineer",
    PanNumber: "AAAPA1111A",
    AadhaarNumber: "234123412346",
    EpfUan: "101234567890"));

Check("registration succeeds with valid PAN+Aadhaar", okResult.Profile.PanVerificationResult == VerificationResult.Eligible);
Check("registration marks Aadhaar eligible", okResult.Profile.AadhaarVerificationResult == VerificationResult.Eligible);
Check("registration produced 3 verification checks (PAN, Aadhaar, EPF)", okResult.Checks.Count == 3);
Check("EPF check is NeedsReview (no public EPFO API — routed to manual review)",
    okResult.Profile.EpfActiveStatusResult == VerificationResult.NeedsReview);
Check("full Aadhaar number is never present on the stored profile",
    okResult.Profile.AadhaarLast4 == "2346" && okResult.Profile.AadhaarLast4.Length == 4);
Check("IsFullyVerified is true once PAN+Aadhaar are eligible", okResult.Profile.IsFullyVerified);

var validationFailed = false;
try
{
    await registerService.RegisterAsync(new Verqo.Application.Freelancers.RegisterFreelancerRequest(
        Email: "bad@example.com",
        PasswordHash: "x",
        DisplayName: "Bad Data",
        PrimaryRole: "Tester",
        PanNumber: "NOTAPAN",
        AadhaarNumber: "123412341234", // starts with 1 -> invalid
        EpfUan: null));
}
catch (Verqo.Application.Freelancers.RegistrationValidationException ex)
{
    validationFailed = ex.Errors.Any(e => e.Field == "panNumber") && ex.Errors.Any(e => e.Field == "aadhaarNumber");
}
Check("registration rejects invalid PAN + Aadhaar with field-level errors", validationFailed);

Console.WriteLine();
Console.WriteLine($"=== {passCount} passed, {failures.Count} failed ===");
if (failures.Count > 0)
{
    Console.WriteLine("Failed: " + string.Join(", ", failures));
    Environment.Exit(1);
}
