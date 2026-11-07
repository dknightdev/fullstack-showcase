using Microsoft.EntityFrameworkCore;
using Portfolio.Catalog.Domain.Products;

namespace Portfolio.Catalog.Infrastructure.Persistence;

public sealed class CatalogDbContext(DbContextOptions<CatalogDbContext> options) : DbContext(options)
{
	public const string Schema = "catalog";

	public DbSet<Product> Products => Set<Product>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.HasDefaultSchema(Schema);
		modelBuilder.ApplyConfigurationsFromAssembly(typeof(CatalogDbContext).Assembly);
	}
}
