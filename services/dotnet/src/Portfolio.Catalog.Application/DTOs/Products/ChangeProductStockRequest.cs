namespace Portfolio.Catalog.Application.DTOs.Products;

/// <summary>Datos para modificar las existencias de un producto.</summary>
public sealed record ChangeProductStockRequest(
	int Quantity
);
