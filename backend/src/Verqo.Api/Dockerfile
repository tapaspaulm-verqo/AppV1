# syntax=docker/dockerfile:1

# --- Build stage ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files first so package restore is cached independently of source changes.
COPY Verqo.sln .
COPY src/Verqo.Domain/Verqo.Domain.csproj src/Verqo.Domain/
COPY src/Verqo.Application/Verqo.Application.csproj src/Verqo.Application/
COPY src/Verqo.Infrastructure/Verqo.Infrastructure.csproj src/Verqo.Infrastructure/
COPY src/Verqo.Api/Verqo.Api.csproj src/Verqo.Api/
RUN dotnet restore src/Verqo.Api/Verqo.Api.csproj

COPY src/ src/
RUN dotnet publish src/Verqo.Api/Verqo.Api.csproj -c Release -o /app --no-restore

# --- Runtime stage ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Run as non-root (required by most cluster PodSecurity policies).
RUN useradd --uid 10001 --create-home --shell /usr/sbin/nologin verqo
USER verqo

COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Verqo.Api.dll"]
