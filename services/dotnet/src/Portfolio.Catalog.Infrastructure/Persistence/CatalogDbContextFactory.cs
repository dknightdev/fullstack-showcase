using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Portfolio.Catalog.Infrastructure.Persistence;

public sealed class CatalogDbContextFactory : IDesignTimeDbContextFactory<CatalogDbContext>
{
	private const string DesignTimeFallback = "Host=localhost;Database=catalog_design_time";

	public CatalogDbContext CreateDbContext(string[] args)
	{
		var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

		var options = new DbContextOptionsBuilder<CatalogDbContext>()
			.UseNpgsql(
				string.IsNullOrWhiteSpace(connectionString) ? DesignTimeFallback : connectionString,
				npgsql => npgsql.MigrationsHistoryTable(DependencyInjection.MigrationsHistoryTable, CatalogDbContext.Schema))
			.Options;

		return new CatalogDbContext(options);
	}
}
