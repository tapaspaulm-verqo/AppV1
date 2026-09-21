// This is the intended, idiomatic test suite (xunit) for the team's normal
// dev/CI environment. It could not be *run* inside this build sandbox
// because api.nuget.org isn't reachable through the egress proxy here, so
// xunit itself can't restore. The same cases were executed for real via
// tools/Verqo.OfflineSmokeTests (zero external packages) before shipping —
// see that project's Program.cs for the verified output. Once this restores
// normally (any dev machine, any CI runner), these tests are the ones to
// trust and extend.

using Verqo.Application.Common;
using Verqo.Application.Freelancers;
using Verqo.Application.Kyc;
using Verqo.Domain.Enums;
using Xunit;

namespace Verqo.Application.Tests;

public class PanValidatorTests
{
    [Theory]
    [InlineData("AAAPA1111A")]
    [InlineData(" aaapa1111a ")]
    public void Accepts_valid_pan(string pan) => Assert.True(PanValidator.Validate(pan).IsValid);

    [Theory]
    [InlineData("AAAPA111A")]      // wrong length
    [InlineData("1AAPA1111A")]     // digit in letter position
    [InlineData("AAAXA1111A")]     // unrecognised holder-type code
    [InlineData("")]
    [InlineData(null)]
    public void Rejects_invalid_pan(string? pan) => Assert.False(PanValidator.Validate(pan).IsValid);
}

public class AadhaarValidatorTests
{
    [Theory]
    [InlineData("234123412346")]
    [InlineData("2341 2341 2346")]
    public void Accepts_valid_aadhaar(string aadhaar) => Assert.True(AadhaarValidator.Validate(aadhaar).IsValid);

    [Theory]
    [InlineData("234123412347")]   // wrong checksum digit
    [InlineData("23412341234")]    // too short
    [InlineData("2341234123466")]  // too long
    [InlineData("034123412340")]   // leading 0
    [InlineData("134123412341")]   // leading 1
    [InlineData("23412341234A")]   // non-digit
    public void Rejects_invalid_aadhaar(string aadhaar) => Assert.False(AadhaarValidator.Validate(aadhaar).IsValid);

    [Fact]
    public void Hash_never_contains_the_raw_number()
    {
        var hash = AadhaarValidator.Hash("234123412346", "pepper");
        Assert.DoesNotContain("234123412346", hash);
    }

    [Fact]
    public void Hash_is_deterministic_and_pepper_sensitive()
    {
        var a = AadhaarValidator.Hash("234123412346", "pepper-1");
        var b = AadhaarValidator.Hash("234123412346", "pepper-1");
        var c = AadhaarValidator.Hash("234123412346", "pepper-2");
        Assert.Equal(a, b);
        Assert.NotEqual(a, c);
    }
}

public class BusinessRulesTests
{
    [Fact]
    public void Standard_plan_charges_ten_percent_client_fee_and_five_percent_freelancer_fee()
    {
        var fees = BusinessRules.CalculateFees(100_000_00, ClientPlan.Standard);
        Assert.Equal(10_000_00, fees.ClientFeeMinor);
        Assert.Equal(5_000_00, fees.FreelancerFeeMinor);
        Assert.Equal(110_000_00, fees.ClientPaysTotalMinor);
        Assert.Equal(95_000_00, fees.FreelancerReceivesMinor);
    }

    [Fact]
    public void Business_plus_falls_to_five_percent_floor_without_a_negotiated_rate()
    {
        var fees = BusinessRules.CalculateFees(100_000_00, ClientPlan.BusinessPlus);
        Assert.Equal(5_000_00, fees.ClientFeeMinor);
    }

    [Fact]
    public void Business_plus_honours_a_negotiated_rate_in_range()
    {
        var fees = BusinessRules.CalculateFees(100_000_00, ClientPlan.BusinessPlus, 0.07);
        Assert.Equal(7_000_00, fees.ClientFeeMinor);
    }

    [Fact]
    public void Rejects_a_negotiated_rate_outside_the_allowed_range() =>
        Assert.Throws<ArgumentOutOfRangeException>(() => BusinessRules.CalculateFees(100_000_00, ClientPlan.BusinessPlus, 0.20));

    [Theory]
    [InlineData(MilestoneState.Unfunded, MilestoneState.Funded, true)]
    [InlineData(MilestoneState.Unfunded, MilestoneState.ApprovedReleased, false)]
    [InlineData(MilestoneState.Submitted, MilestoneState.InProgress, true)]
    [InlineData(MilestoneState.ApprovedReleased, MilestoneState.Disputed, false)]
    public void Milestone_state_machine_allows_only_documented_transitions(MilestoneState from, MilestoneState to, bool expected) =>
        Assert.Equal(expected, BusinessRules.CanTransition(from, to));
}

public class RegisterFreelancerServiceTests
{
    private static RegisterFreelancerService NewService() => new(new MockKycVerificationService(), "test-pepper");

    [Fact]
    public async Task Registers_a_freelancer_with_valid_pan_and_aadhaar()
    {
        var result = await NewService().RegisterAsync(new RegisterFreelancerRequest(
            Email: "arjun.dev@example.com",
            PasswordHash: "hash",
            DisplayName: "Arjun Dev",
            PrimaryRole: "Backend Engineer",
            PanNumber: "AAAPA1111A",
            AadhaarNumber: "234123412346",
            EpfUan: "101234567890"));

        Assert.Equal(VerificationResult.Eligible, result.Profile.PanVerificationResult);
        Assert.Equal(VerificationResult.Eligible, result.Profile.AadhaarVerificationResult);
        Assert.True(result.Profile.IsFullyVerified);
        Assert.Equal("2346", result.Profile.AadhaarLast4);
        Assert.Equal(3, result.Checks.Count);
    }

    [Fact]
    public async Task Rejects_registration_with_invalid_pan_and_aadhaar()
    {
        var ex = await Assert.ThrowsAsync<RegistrationValidationException>(() => NewService().RegisterAsync(new RegisterFreelancerRequest(
            Email: "bad@example.com",
            PasswordHash: "hash",
            DisplayName: "Bad Data",
            PrimaryRole: "Tester",
            PanNumber: "NOTAPAN",
            AadhaarNumber: "123412341234",
            EpfUan: null)));

        Assert.Contains(ex.Errors, e => e.Field == "panNumber");
        Assert.Contains(ex.Errors, e => e.Field == "aadhaarNumber");
    }
}
