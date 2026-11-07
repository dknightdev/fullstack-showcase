using Microsoft.EntityFrameworkCore;
using Npgsql;
using Portfolio.Catalog.Application.Exceptions;
using Portfolio.Catalog.Application.Interfaces;
using Portfolio.Catalog.Domain.Products;

namespace Portfolio.Catalog.Infrastructure.Persistence;

internal sealed class ProductRepository(CatalogDbContext dbContext) : IProductRepository
{
	private const string SkuIndexName = "ix_products_sku";
	private const string LikeEscape = "\\";

	public Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
		dbContext.Products.FirstOrDefaultAsync(product => product.Id == id, cancellationToken);

	public Task<bool> SkuExistsAsync(string sku, int? excludingId, CancellationToken cancellationToken) =>
		dbContext.Products.AnyAsync(
			product => product.Sku == sku && (excludingId == null || product.Id != excludingId),
			cancellationToken);

	public async Task<ProductPage> SearchAsync(ProductSearchCriteria criteria, CancellationToken cancellationToken)
	{
		var query = dbContext.Products
			.AsNoTracking()
			.Where(product => product.IsActive == criteria.IsActive);

		if (criteria.Search is not null)
		{
			var pattern = $"%{EscapeLike(criteria.Search)}%";

			query = query.Where(product =>
				EF.Functions.ILike(product.Name, pattern, LikeEscape)
				|| EF.Functions.ILike(product.Sku, pattern, LikeEscape));
		}

		var totalCount = await query.CountAsync(cancellationToken);

		var items = await ApplyOrdering(query, criteria)
			.Skip((criteria.Page - 1) * criteria.PageSize)
			.Take(criteria.PageSize)
			.ToListAsync(cancellationToken);

		return new ProductPage(items, totalCount);
	}

	public async Task AddAsync(Product product, CancellationToken cancellationToken)
	{
		dbContext.Products.Add(product);

		await SaveAsync(product.Sku, cancellationToken);
	}

	public Task UpdateAsync(Product product, CancellationToken cancellationToken) =>
		SaveAsync(product.Sku, cancellationToken);

	public async Task DeleteAsync(Product product, CancellationToken cancellationToken)
	{
		dbContext.Products.Remove(product);

		await SaveAsync(product.Sku, cancellationToken);
	}

	private async Task SaveAsync(string sku, CancellationToken cancellationToken)
	{
		try
		{
			await dbContext.SaveChangesAsync(cancellationToken);
		}
		catch (DbUpdateConcurrencyException)
		{
			throw new ConcurrencyConflictException();
		}
		catch (DbUpdateException exception) when (
			exception.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation } postgresError
			&& postgresError.ConstraintName == SkuIndexName)
		{
			throw new DuplicateSkuException(sku);
		}
	}

	private static IOrderedQueryable<Product> ApplyOrdering(IQueryable<Product> query, ProductSearchCriteria criteria)
	{
		var descending = criteria.SortDirection == ProductSortDirection.Desc;

		var ordered = criteria.SortBy switch
		{
			ProductSortField.Name => Order(query, product => product.Name, descending),
			ProductSortField.Sku => Order(query, product => product.Sku, descending),
			ProductSortField.Price => Order(query, product => product.Price, descending),
			ProductSortField.StockQuantity => Order(query, product => product.StockQuantity, descending),
			ProductSortField.CreatedAt => Order(query, product => product.CreatedAt, descending),
			ProductSortField.UpdatedAt => Order(query, product => product.UpdatedAt, descending),
			_ => throw new ArgumentOutOfRangeException(nameof(criteria), criteria.SortBy, "Campo de orden no permitido.")
		};

		return ordered.ThenBy(product => product.Id);
	}

	private static IOrderedQueryable<Product> Order<TKey>(
		IQueryable<Product> query,
		System.Linq.Expressions.Expression<Func<Product, TKey>> key,
		bool descending) =>
		descending ? query.OrderByDescending(key) : query.OrderBy(key);

	private static string EscapeLike(string value) =>
		value
			.Replace(LikeEscape, LikeEscape + LikeEscape, StringComparison.Ordinal)
			.Replace("%", LikeEscape + "%", StringComparison.Ordinal)
			.Replace("_", LikeEscape + "_", StringComparison.Ordinal);
}
