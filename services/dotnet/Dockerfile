
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore Portfolio.Catalog.slnx

RUN dotnet publish src/Portfolio.Catalog.Api/Portfolio.Catalog.Api.csproj \
	-c Release \
	-o /app/publish \
	--no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "dotnet Portfolio.Catalog.Api.dll --urls http://0.0.0.0:${PORT:-8080}"]
