using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Verqo.Api.Auth;
using Verqo.Application.Clients;
using Verqo.Application.Freelancers;
using Verqo.Application.Kyc;
using Verqo.Application.Payments;
using Verqo.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// --- Configuration ---
// In Kubernetes these come from a ConfigMap (non-secret) + Secret
// (connection string, JWT signing key, Aadhaar hash pepper) mounted as env
// vars — see deploy/helm/verqo/templates. Local dev uses `dotnet user-secrets`.
var connectionString = builder.Configuration.GetConnectionString("VerqoDb")
    ?? throw new InvalidOperationException("ConnectionStrings:VerqoDb is not configured.");
var jwtSigningKey = builder.Configuration["Jwt:SigningKey"]
    ?? throw new InvalidOperationException("Jwt:SigningKey is not configured.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "verqo-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "verqo-clients";
var aadhaarHashPepper = builder.Configuration["Kyc:AadhaarHashPepper"]
    ?? throw new InvalidOperationException("Kyc:AadhaarHashPepper is not configured.");

// --- Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Verqo API", Version = "v1" });
});

builder.Services.AddDbContext<VerqoDbContext>(options => options.UseNpgsql(connectionString));

// One API, three clients: Angular web app, Android app, iOS app all call
// this same surface — CORS only matters for the browser client; the mobile
// apps aren't subject to it.
builder.Services.AddCors(options =>
{
    options.AddPolicy("VerqoWeb", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? ["http://localhost:4200"];
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSigningKey)),
        };
    });
builder.Services.AddAuthorization();

// KYC verification: mock adapter today (see IKycVerificationService docs for
// the real vendors this stands in for). Swap the registration below for a
// real adapter once one is contracted — no caller changes needed.
builder.Services.AddScoped<IKycVerificationService, MockKycVerificationService>();

// Payment gateway / escrow: explicitly v2a scope per this rebuild's brief —
// mock adapter only.
builder.Services.AddScoped<IPaymentGatewayAdapter, MockPaymentGatewayAdapter>();

builder.Services.AddScoped(sp => new RegisterFreelancerService(
    sp.GetRequiredService<IKycVerificationService>(),
    aadhaarHashPepper));

// Issues the JWTs the AddJwtBearer call above validates — same three
// config values, see JwtTokenService remarks for why it's constructed
// here rather than reading IConfiguration itself.
builder.Services.AddScoped(_ => new JwtTokenService(jwtIssuer, jwtAudience, jwtSigningKey));

// Client registration has no external verification dependency yet (see
// RegisterClientService remarks), so it's a plain scoped service.
builder.Services.AddScoped<RegisterClientService>();

// Kubernetes liveness/readiness probes (see deploy/helm/verqo/templates/api-deployment.yaml).
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, name: "postgres", tags: ["ready"]);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("VerqoWeb");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// /healthz: liveness — process is up. /readyz: readiness — dependencies
// (Postgres) are reachable. Kept unauthenticated and outside API
// versioning, as is conventional for k8s probes.
app.MapHealthChecks("/healthz");
app.MapHealthChecks("/readyz", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
});

app.Run();

// Exposed for WebApplicationFactory-based integration tests once NuGet access is available.
public partial class Program { }
