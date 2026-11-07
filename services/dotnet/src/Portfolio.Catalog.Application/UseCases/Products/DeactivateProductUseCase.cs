using Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.Exceptions;
using Portfolio.Catalog.Application.Interfaces;

namespace Portfolio.Catalog.Application.UseCases.Products;

/// <summary>
/// Caso de uso para desactivar un producto.
/// </summary>
public sealed class DeactivateProductUseCase(
	IProductRepository repository,
	TimeProvider timeProvider)
{
	public async Task<ProductResponse> ExecuteAsync(
		int id,
		CancellationToken cancellationToken)
	{
		var product = await repository.GetByIdAsync(id, cancellationToken)
			?? throw new ProductNotFoundException(id);

		if (product.IsActive)
		{
			product.Deactivate(timeProvider.GetUtcNow());

			await repository.UpdateAsync(product, cancellationToken);
		}

		return ProductResponse.From(product);
	}
}
