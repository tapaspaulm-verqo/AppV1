using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Verqo.Infrastructure.Persistence;

/// <summary>
/// Design-time factory so `dotnet ef migrations add ...` works without a
/// running API host or a live database — it only needs to build the model.
/// Point ConnectionStrings__VerqoDb at a real (even unreachable) Postgres
/// connection string; EF only inspects the model to generate migrations.
/// </summary>
public class VerqoDbContextFactory : IDesignTimeDbContextFactory<VerqoDbContext>
{
    public VerqoDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__VerqoDb")
            ?? "Host=localhost;Database=verqo;Username=verqo;Password=verqo";

        var optionsBuilder = new DbContextOptionsBuilder<VerqoDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new VerqoDbContext(optionsBuilder.Options);
    }
}
