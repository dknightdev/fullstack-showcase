namespace Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.Interfaces;

/// <summary>Parámetros de consulta del listado de productos.</summary>
public sealed record ListProductsRequest
{
	public const int DefaultPage = 1;
	public const int DefaultPageSize = 10;
	public const int MaxPageSize = 100;
	public const int SearchMaxLength = 100;


	public int Page { get; init; } = DefaultPage;
	public int PageSize { get; init; } = DefaultPageSize;
	public string? Search { get; init; }

	/// <summary>Si se omite, solo se listan productos activos (catálogo público).</summary>
	public bool? IsActive { get; init; }

	public ProductSortField SortBy { get; init; } = ProductSortField.Name;
	public ProductSortDirection SortDirection { get; init; } = ProductSortDirection.Asc;
}
