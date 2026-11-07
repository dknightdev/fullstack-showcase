namespace Portfolio.Catalog.Application.DTOs.Products;

/// <summary>Datos para establecer las existencias de un producto.</summary>
public sealed record SetProductStockRequest(
	int StockQuantity
);
