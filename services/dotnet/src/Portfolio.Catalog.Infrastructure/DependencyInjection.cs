using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Catalog.Application.Interfaces;
using Portfolio.Catalog.Infrastructure.Persistence;

namespace Portfolio.Catalog.Infrastructure;

public static class DependencyInjection
{
	public const string ConnectionStringName = "DefaultConnection";
	internal const string MigrationsHistoryTable = "__ef_migrations_history";

	public static IServiceCollection AddCatalogInfrastructure(this IServiceCollection services)
	{
		services.AddDbContext<CatalogDbContext>((serviceProvider, options) =>
		{
			var connectionString = serviceProvider
				.GetRequiredService<IConfiguration>()
				.GetConnectionString(ConnectionStringName);

			if (string.IsNullOrWhiteSpace(connectionString))
			{
				throw new InvalidOperationException(
					$"Falta la cadena de conexión '{ConnectionStringName}'. " +
					"Defina la variable de entorno ConnectionStrings__DefaultConnection.");
			}

			options.UseNpgsql(connectionString, npgsql =>
			{
				npgsql.MigrationsHistoryTable(MigrationsHistoryTable, CatalogDbContext.Schema);
				npgsql.EnableRetryOnFailure(maxRetryCount: 3);
			});
		});

		services.AddScoped<IProductRepository, ProductRepository>();

		return services;
	}
}
