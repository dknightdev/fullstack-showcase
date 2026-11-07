using Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.Exceptions;
using Portfolio.Catalog.Application.Interfaces;

namespace Portfolio.Catalog.Application.UseCases.Products;

/// <summary>
/// Caso de uso para incrementar las existencias de un producto.
/// </summary>
public sealed class IncreaseProductStockUseCase(
	IProductRepository repository,
	TimeProvider timeProvider)
{
	public async Task<ProductResponse> ExecuteAsync(
		int id,
		ChangeProductStockRequest request,
		CancellationToken cancellationToken)
	{
		var product = await repository.GetByIdAsync(id, cancellationToken)
			?? throw new ProductNotFoundException(id);

		product.IncreaseStock(request.Quantity, timeProvider.GetUtcNow());

		await repository.UpdateAsync(product, cancellationToken);

		return ProductResponse.From(product);
	}
}
