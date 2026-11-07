namespace Portfolio.Catalog.Application.DTOs.Products;

/// <summary>Datos para crear un producto.</summary>
public sealed record CreateProductRequest(
	string Name,
	string? Description,
	string Sku,
	decimal Price,
	int StockQuantity
);
