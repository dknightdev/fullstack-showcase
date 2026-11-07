namespace Portfolio.Catalog.Application.DTOs.Products;

/// <summary>Datos para actualizar la información de un producto.</summary>
public sealed record UpdateProductRequest(
	string Name,
	string? Description,
	string Sku,
	decimal Price
);
