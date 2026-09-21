using Microsoft.EntityFrameworkCore;
using Verqo.Domain.Entities;

namespace Verqo.Infrastructure.Persistence;

/// <summary>
/// EF Core DbContext, Npgsql provider (PostgreSQL) — see
/// docs/ARCHITECTURE.md for why PostgreSQL over the previous Cloud Spanner
/// target. Entity shape mirrors the original Prisma schema field-for-field
/// so the migration preserves the same data model and the same
/// state-machine/ledger invariants (Verqo.Application.Common.BusinessRules).
/// </summary>
public class VerqoDbContext(DbContextOptions<VerqoDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<VerificationCheck> VerificationChecks => Set<VerificationCheck>();
    public DbSet<FreelancerProfile> FreelancerProfiles => Set<FreelancerProfile>();
    public DbSet<ClientProfile> ClientProfiles => Set<ClientProfile>();
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<Proposal> Proposals => Set<Proposal>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<Milestone> Milestones => Set<Milestone>();
    public DbSet<LedgerEntry> LedgerEntries => Set<LedgerEntry>();
    public DbSet<Payout> Payouts => Set<Payout>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Dispute> Disputes => Set<Dispute>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Store all enums as their string name (readable in psql / support
        // log queries, matches the terminal-support-video conventions) —
        // costs a little storage, worth it for operability.
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType.IsEnum || Nullable.GetUnderlyingType(property.ClrType)?.IsEnum == true)
                {
                    var converterType = typeof(Microsoft.EntityFrameworkCore.Storage.ValueConversion.EnumToStringConverter<>)
                        .MakeGenericType(Nullable.GetUnderlyingType(property.ClrType) ?? property.ClrType);
                    property.SetValueConverter((Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter)
                        Activator.CreateInstance(converterType, (object?)null)!);
                }
            }
        }

        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasIndex(u => u.Email).IsUnique();
            e.HasOne(u => u.FreelancerProfile).WithOne(p => p.User).HasForeignKey<FreelancerProfile>(p => p.UserId);
            e.HasOne(u => u.ClientProfile).WithOne(p => p.User).HasForeignKey<ClientProfile>(p => p.UserId);
        });

        modelBuilder.Entity<VerificationCheck>(e =>
        {
            e.ToTable("verification_checks");
            e.HasIndex(v => new { v.UserId, v.Stage }).IsUnique();
            e.HasOne(v => v.User).WithMany(u => u.VerificationChecks).HasForeignKey(v => v.UserId);
        });

        modelBuilder.Entity<FreelancerProfile>(e =>
        {
            e.ToTable("freelancer_profiles");
            e.HasIndex(f => f.UserId).IsUnique();
            e.HasIndex(f => f.AadhaarHash); // duplicate-account detection, never a unique full Aadhaar column
            e.HasMany(f => f.Proposals).WithOne(p => p.Freelancer).HasForeignKey(p => p.FreelancerId);
            e.HasMany(f => f.Contracts).WithOne(c => c.Freelancer).HasForeignKey(c => c.FreelancerId);
        });

        modelBuilder.Entity<ClientProfile>(e =>
        {
            e.ToTable("client_profiles");
            e.HasIndex(c => c.UserId).IsUnique();
            e.HasMany(c => c.Jobs).WithOne(j => j.Client).HasForeignKey(j => j.ClientId);
            e.HasMany(c => c.Contracts).WithOne(c => c.Client).HasForeignKey(c => c.ClientId);
        });

        modelBuilder.Entity<Job>(e =>
        {
            e.ToTable("jobs");
            e.HasMany(j => j.Proposals).WithOne(p => p.Job).HasForeignKey(p => p.JobId);
        });

        modelBuilder.Entity<Proposal>(e =>
        {
            e.ToTable("proposals");
            e.HasIndex(p => new { p.JobId, p.FreelancerId }).IsUnique();
        });

        modelBuilder.Entity<Contract>(e =>
        {
            e.ToTable("contracts");
            e.HasOne(c => c.Job).WithMany(j => j.Contracts).HasForeignKey(c => c.JobId);
            e.HasMany(c => c.Milestones).WithOne(m => m.Contract).HasForeignKey(m => m.ContractId);
        });

        modelBuilder.Entity<Milestone>(e =>
        {
            e.ToTable("milestones");
            e.HasMany(m => m.LedgerEntries).WithOne(l => l.Milestone).HasForeignKey(l => l.MilestoneId);
            e.HasOne(m => m.Dispute).WithOne(d => d.Milestone).HasForeignKey<Dispute>(d => d.MilestoneId);
            e.HasOne(m => m.Invoice).WithOne(i => i.Milestone).HasForeignKey<Invoice>(i => i.MilestoneId);
        });

        modelBuilder.Entity<LedgerEntry>(e =>
        {
            e.ToTable("ledger_entries");
            e.HasIndex(l => l.IdempotencyKey).IsUnique();
            e.HasIndex(l => l.MilestoneId);
        });

        modelBuilder.Entity<Payout>(e => e.ToTable("payouts"));

        modelBuilder.Entity<Invoice>(e =>
        {
            e.ToTable("invoices");
            e.HasIndex(i => i.MilestoneId).IsUnique();
            e.HasIndex(i => i.InvoiceNumber).IsUnique();
        });

        modelBuilder.Entity<Message>(e =>
        {
            e.ToTable("messages");
            e.HasIndex(m => m.ContractId);
        });

        modelBuilder.Entity<Review>(e => e.ToTable("reviews"));

        modelBuilder.Entity<Dispute>(e =>
        {
            e.ToTable("disputes");
            e.HasIndex(d => d.MilestoneId).IsUnique();
        });
    }
}
