namespace Portfolio.Catalog.Application.Interfaces;
using Portfolio.Catalog.Domain.Products;


/// <summary>
/// Campos por los que se permite ordenar los productos.
/// </summary>
public enum ProductSortField
{
	Name,
	Sku,
	Price,
	StockQuantity,
	CreatedAt,
	UpdatedAt
}

/// <summary>
/// Dirección del ordenamiento de los productos.
/// </summary>
public enum ProductSortDirection
{
	Asc,
	Desc
}

/// <summary>
/// Criterios validados y normalizados para consultar los productos.
/// </summary>
public sealed record ProductSearchCriteria(
	int Page,
	int PageSize,
	string? Search,
	bool IsActive,
	ProductSortField SortBy,
	ProductSortDirection SortDirection);

/// <summary>
/// Resultado paginado de una búsqueda de productos.
/// </summary>
public sealed record ProductPage(IReadOnlyList<Product> Items, int TotalCount);



public interface IProductRepository
{
	/// <summary>
	/// Devuelve un producto por su identificador.
	/// </summary>
	Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken);

	/// <summary>
	/// Comprueba si un SKU ya está registrado.
	/// </summary>
	Task<bool> SkuExistsAsync(string sku, int? excludingId, CancellationToken cancellationToken);

	/// <summary>
	/// Busca productos aplicando filtros, ordenamiento y paginación.
	/// </summary>
	Task<ProductPage> SearchAsync(ProductSearchCriteria criteria, CancellationToken cancellationToken);

	/// <summary>
	/// Agrega un producto.
	/// </summary>
	/// <exception cref="Exceptions.DuplicateSkuException">
	/// Otro registro obtuvo el SKU primero.
	/// </exception>
	Task AddAsync(Product product, CancellationToken cancellationToken);

	/// <summary>
	/// Actualiza un producto existente.
	/// </summary>
	/// <exception cref="Exceptions.DuplicateSkuException">
	/// Otro registro obtuvo el SKU primero.
	/// </exception>
	/// <exception cref="Exceptions.ConcurrencyConflictException">
	/// La fila cambió desde que se leyó.
	/// </exception>
	Task UpdateAsync(Product product, CancellationToken cancellationToken);

	/// <summary>
	/// Elimina un producto existente.
	/// </summary>
	/// <exception cref="Exceptions.ConcurrencyConflictException">
	/// La fila cambió o desapareció desde que se leyó.
	/// </exception>
	Task DeleteAsync(Product product, CancellationToken cancellationToken);
}
