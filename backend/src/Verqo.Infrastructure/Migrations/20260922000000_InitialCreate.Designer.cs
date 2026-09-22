using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Verqo.Infrastructure.Persistence;

#nullable disable

namespace Verqo.Infrastructure.Migrations;

/// <summary>
/// Carries the [Migration] attribute that lets EF Core's migration scanner
/// find and apply 20260922000000_InitialCreate.cs at all, plus the model
/// snapshot as of this migration. See that file's remarks for why this is
/// hand-written, and VerqoDbContextModelSnapshot.cs's remarks for why this
/// sticks to a deliberately narrow, stable slice of the ModelBuilder fluent
/// API — this file's BuildTargetModel is identical to that one's BuildModel
/// (there's only one migration so far, so the "as of this point" snapshot
/// and the "current" snapshot are the same model).
/// </summary>
[DbContext(typeof(VerqoDbContext))]
[Migration("20260922000000_InitialCreate")]
partial class InitialCreate
{
    protected override void BuildTargetModel(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity("Verqo.Domain.Entities.User", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<string>("Email").IsRequired().HasColumnType("text");
            b.Property<string>("PasswordHash").IsRequired().HasColumnType("text");
            b.Property<string>("Role").IsRequired().HasColumnType("text");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("UpdatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("Email").IsUnique();
            b.ToTable("users");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.VerificationCheck", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("UserId").HasColumnType("uuid");
            b.Property<string>("Stage").IsRequired().HasColumnType("text");
            b.Property<string>("Result").IsRequired().HasColumnType("text");
            b.Property<string>("PartnerReference").HasColumnType("text");
            b.Property<DateTime?>("CheckedAt").HasColumnType("timestamp with time zone");
            b.Property<bool>("RequiresHumanReview").HasColumnType("boolean");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("UserId", "Stage").IsUnique();
            b.ToTable("verification_checks");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.FreelancerProfile", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("UserId").HasColumnType("uuid");
            b.Property<string>("DisplayName").IsRequired().HasColumnType("text");
            b.Property<string>("Headline").HasColumnType("text");
            b.Property<string>("Bio").HasColumnType("text");
            b.Property<string>("PrimaryRole").IsRequired().HasColumnType("text");
            b.Property<string>("RateBand").HasColumnType("text");
            b.Property<string>("ExperienceLevel").HasColumnType("text");
            b.Property<int?>("HourlyRateMinor").HasColumnType("integer");
            b.Property<string>("PanNumber").IsRequired().HasColumnType("text");
            b.Property<string>("PanVerificationResult").IsRequired().HasColumnType("text");
            b.Property<DateTime?>("PanVerifiedAt").HasColumnType("timestamp with time zone");
            b.Property<string>("PanVerificationReference").HasColumnType("text");
            b.Property<string>("AadhaarLast4").IsRequired().HasColumnType("text");
            b.Property<string>("AadhaarHash").IsRequired().HasColumnType("text");
            b.Property<string>("AadhaarVerificationResult").IsRequired().HasColumnType("text");
            b.Property<DateTime?>("AadhaarVerifiedAt").HasColumnType("timestamp with time zone");
            b.Property<string>("AadhaarVerificationReference").HasColumnType("text");
            b.Property<string>("EpfUanLast4").HasColumnType("text");
            b.Property<string>("EpfActiveStatusResult").IsRequired().HasColumnType("text");
            b.Property<DateTime?>("EpfCheckedAt").HasColumnType("timestamp with time zone");
            b.Property<string>("EpfVerificationReference").HasColumnType("text");
            b.Property<DateTime?>("BankAccountVerifiedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime?>("BankDetailChangedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("UpdatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("UserId").IsUnique();
            b.HasIndex("AadhaarHash");
            b.ToTable("freelancer_profiles");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.ClientProfile", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("UserId").HasColumnType("uuid");
            b.Property<string>("CompanyName").IsRequired().HasColumnType("text");
            b.Property<string>("Gstin").HasColumnType("text");
            b.Property<string>("Plan").IsRequired().HasColumnType("text");
            b.Property<double?>("NegotiatedFeeRate").HasColumnType("double precision");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("UpdatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("UserId").IsUnique();
            b.ToTable("client_profiles");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Job", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("ClientId").HasColumnType("uuid");
            b.Property<string>("Title").IsRequired().HasColumnType("text");
            b.Property<string>("Description").IsRequired().HasColumnType("text");
            b.Property<string>("Channel").IsRequired().HasColumnType("text");
            b.Property<string>("RoleCategory").IsRequired().HasColumnType("text");
            b.Property<int?>("BudgetMinorMin").HasColumnType("integer");
            b.Property<int?>("BudgetMinorMax").HasColumnType("integer");
            b.Property<string>("Status").IsRequired().HasColumnType("text");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("UpdatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("ClientId");
            b.ToTable("jobs");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Proposal", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("JobId").HasColumnType("uuid");
            b.Property<Guid>("FreelancerId").HasColumnType("uuid");
            b.Property<string>("CoverNote").IsRequired().HasColumnType("text");
            b.Property<int>("ProposedRateMinor").HasColumnType("integer");
            b.Property<string>("Status").IsRequired().HasColumnType("text");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("JobId", "FreelancerId").IsUnique();
            b.HasIndex("FreelancerId");
            b.ToTable("proposals");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Contract", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid?>("JobId").HasColumnType("uuid");
            b.Property<Guid>("ClientId").HasColumnType("uuid");
            b.Property<Guid>("FreelancerId").HasColumnType("uuid");
            b.Property<string>("Channel").IsRequired().HasColumnType("text");
            b.Property<string>("ScopeSummary").IsRequired().HasColumnType("text");
            b.Property<string>("Status").IsRequired().HasColumnType("text");
            b.Property<DateTime>("IntroducedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("UpdatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("JobId");
            b.HasIndex("ClientId");
            b.HasIndex("FreelancerId");
            b.ToTable("contracts");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Milestone", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("ContractId").HasColumnType("uuid");
            b.Property<string>("Title").IsRequired().HasColumnType("text");
            b.Property<int>("ContractValueMinor").HasColumnType("integer");
            b.Property<string>("State").IsRequired().HasColumnType("text");
            b.Property<int>("ReviewWindowDays").HasColumnType("integer");
            b.Property<int>("RevisionsAllowed").HasColumnType("integer");
            b.Property<int>("RevisionsUsed").HasColumnType("integer");
            b.Property<DateTime?>("FundedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime?>("SubmittedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime?>("ReviewDeadlineAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime?>("ReleasedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("UpdatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("ContractId");
            b.ToTable("milestones");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.LedgerEntry", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("MilestoneId").HasColumnType("uuid");
            b.Property<string>("Type").IsRequired().HasColumnType("text");
            b.Property<int>("AmountMinor").HasColumnType("integer");
            b.Property<string>("Currency").IsRequired().HasColumnType("text");
            b.Property<string>("IdempotencyKey").IsRequired().HasColumnType("text");
            b.Property<Guid?>("ReversesEntryId").HasColumnType("uuid");
            b.Property<string>("GatewayReference").HasColumnType("text");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("IdempotencyKey").IsUnique();
            b.HasIndex("MilestoneId");
            b.ToTable("ledger_entries");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Payout", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("MilestoneId").HasColumnType("uuid");
            b.Property<string>("Rail").IsRequired().HasColumnType("text");
            b.Property<string>("Status").IsRequired().HasColumnType("text");
            b.Property<int>("AmountMinor").HasColumnType("integer");
            b.Property<string>("Utr").HasColumnType("text");
            b.Property<DateTime>("AttemptedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime?>("SettledAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.ToTable("payouts");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Invoice", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("MilestoneId").HasColumnType("uuid");
            b.Property<string>("InvoiceNumber").IsRequired().HasColumnType("text");
            b.Property<int>("GstAmountMinor").HasColumnType("integer");
            b.Property<int>("TotalMinor").HasColumnType("integer");
            b.Property<DateTime>("IssuedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("MilestoneId").IsUnique();
            b.HasIndex("InvoiceNumber").IsUnique();
            b.ToTable("invoices");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Message", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("ContractId").HasColumnType("uuid");
            b.Property<Guid>("SenderId").HasColumnType("uuid");
            b.Property<string>("Body").IsRequired().HasColumnType("text");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("ContractId");
            b.ToTable("messages");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Review", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("ContractId").HasColumnType("uuid");
            b.Property<Guid>("AuthorId").HasColumnType("uuid");
            b.Property<int>("Rating").HasColumnType("integer");
            b.Property<string>("Comment").HasColumnType("text");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.ToTable("reviews");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Dispute", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("uuid");
            b.Property<Guid>("MilestoneId").HasColumnType("uuid");
            b.Property<Guid>("RaisedById").HasColumnType("uuid");
            b.Property<string>("Reason").IsRequired().HasColumnType("text");
            b.Property<DateTime>("EvidenceDeadline").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("DecisionDeadline").HasColumnType("timestamp with time zone");
            b.Property<string>("Outcome").HasColumnType("text");
            b.Property<DateTime?>("DecidedAt").HasColumnType("timestamp with time zone");
            b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone");

            b.HasKey("Id");
            b.HasIndex("MilestoneId").IsUnique();
            b.ToTable("disputes");
        });

        // --- Relationships (second pass — mirrors how `dotnet ef` itself orders a scaffolded snapshot) ---

        modelBuilder.Entity("Verqo.Domain.Entities.VerificationCheck", b =>
        {
            b.HasOne("Verqo.Domain.Entities.User", "User")
                .WithMany("VerificationChecks")
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("User");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.FreelancerProfile", b =>
        {
            b.HasOne("Verqo.Domain.Entities.User", "User")
                .WithOne("FreelancerProfile")
                .HasForeignKey("Verqo.Domain.Entities.FreelancerProfile", "UserId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("User");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.ClientProfile", b =>
        {
            b.HasOne("Verqo.Domain.Entities.User", "User")
                .WithOne("ClientProfile")
                .HasForeignKey("Verqo.Domain.Entities.ClientProfile", "UserId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("User");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Job", b =>
        {
            b.HasOne("Verqo.Domain.Entities.ClientProfile", "Client")
                .WithMany("Jobs")
                .HasForeignKey("ClientId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("Client");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Proposal", b =>
        {
            b.HasOne("Verqo.Domain.Entities.Job", "Job")
                .WithMany("Proposals")
                .HasForeignKey("JobId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.HasOne("Verqo.Domain.Entities.FreelancerProfile", "Freelancer")
                .WithMany("Proposals")
                .HasForeignKey("FreelancerId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("Job");
            b.Navigation("Freelancer");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Contract", b =>
        {
            b.HasOne("Verqo.Domain.Entities.Job", "Job")
                .WithMany("Contracts")
                .HasForeignKey("JobId")
                .OnDelete(DeleteBehavior.Restrict);
            b.HasOne("Verqo.Domain.Entities.ClientProfile", "Client")
                .WithMany("Contracts")
                .HasForeignKey("ClientId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.HasOne("Verqo.Domain.Entities.FreelancerProfile", "Freelancer")
                .WithMany("Contracts")
                .HasForeignKey("FreelancerId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("Job");
            b.Navigation("Client");
            b.Navigation("Freelancer");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Milestone", b =>
        {
            b.HasOne("Verqo.Domain.Entities.Contract", "Contract")
                .WithMany("Milestones")
                .HasForeignKey("ContractId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("Contract");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.LedgerEntry", b =>
        {
            b.HasOne("Verqo.Domain.Entities.Milestone", "Milestone")
                .WithMany("LedgerEntries")
                .HasForeignKey("MilestoneId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("Milestone");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Invoice", b =>
        {
            b.HasOne("Verqo.Domain.Entities.Milestone", "Milestone")
                .WithOne("Invoice")
                .HasForeignKey("Verqo.Domain.Entities.Invoice", "MilestoneId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("Milestone");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Dispute", b =>
        {
            b.HasOne("Verqo.Domain.Entities.Milestone", "Milestone")
                .WithOne("Dispute")
                .HasForeignKey("Verqo.Domain.Entities.Dispute", "MilestoneId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
            b.Navigation("Milestone");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.User", b =>
        {
            b.Navigation("FreelancerProfile");
            b.Navigation("ClientProfile");
            b.Navigation("VerificationChecks");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.FreelancerProfile", b =>
        {
            b.Navigation("Proposals");
            b.Navigation("Contracts");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.ClientProfile", b =>
        {
            b.Navigation("Jobs");
            b.Navigation("Contracts");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Job", b =>
        {
            b.Navigation("Proposals");
            b.Navigation("Contracts");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Contract", b =>
        {
            b.Navigation("Milestones");
        });

        modelBuilder.Entity("Verqo.Domain.Entities.Milestone", b =>
        {
            b.Navigation("LedgerEntries");
            b.Navigation("Dispute");
            b.Navigation("Invoice");
        });
    }
}
