namespace Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Domain.Products;

public sealed record ProductResponse(
	int Id,
	string Name,
	string? Description,
	string Sku,
	decimal Price,
	int StockQuantity,
	bool IsActive,
	DateTimeOffset CreatedAt,
	DateTimeOffset UpdatedAt)
{
	public static ProductResponse From(Product product) => new(
		product.Id,
		product.Name,
		product.Description,
		product.Sku,
		product.Price,
		product.StockQuantity,
		product.IsActive,
		product.CreatedAt,
		product.UpdatedAt
	);
}
