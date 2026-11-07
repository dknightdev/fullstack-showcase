using Portfolio.Catalog.Application.Common;
using Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.Interfaces;

namespace Portfolio.Catalog.Application.UseCases.Products;

/// <summary>
/// Caso de uso para listar productos.
/// </summary>
public sealed class ListProductsUseCase(IProductRepository repository)
{
	public async Task<PagedResult<ProductResponse>> ExecuteAsync(
		ListProductsRequest request,
		CancellationToken cancellationToken)
	{
		var criteria = ListProductsValidator.ValidateAndNormalize(request);

		var page = await repository.SearchAsync(criteria, cancellationToken);

		var totalPages = (int)Math.Ceiling(
			page.TotalCount / (double)criteria.PageSize);

		return new PagedResult<ProductResponse>(
			page.Items.Select(ProductResponse.From).ToList(),
			criteria.Page,
			criteria.PageSize,
			page.TotalCount,
			totalPages);
	}
}
