using Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.Exceptions;
using Portfolio.Catalog.Application.Interfaces;

namespace Portfolio.Catalog.Application.UseCases.Products;

/// <summary>
/// Caso de uso para consultar un producto.
/// </summary>
public sealed class GetProductUseCase(IProductRepository repository)
{
	public async Task<ProductResponse> ExecuteAsync(
		int id,
		CancellationToken cancellationToken)
	{
		var product = await repository.GetByIdAsync(id, cancellationToken)
			?? throw new ProductNotFoundException(id);

		return ProductResponse.From(product);
	}
}
