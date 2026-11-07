using Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.Exceptions;
using Portfolio.Catalog.Application.Interfaces;

namespace Portfolio.Catalog.Application.UseCases.Products;

/// <summary>
/// Caso de uso para actualizar la información de un producto.
/// </summary>
public sealed class UpdateProductUseCase(
	IProductRepository repository,
	TimeProvider timeProvider)
{
	public async Task<ProductResponse> ExecuteAsync(
		int id,
		UpdateProductRequest request,
		CancellationToken cancellationToken)
	{
		var product = await repository.GetByIdAsync(id, cancellationToken)
			?? throw new ProductNotFoundException(id);

		var previousSku = product.Sku;

		product.UpdateDetails(
			request.Name,
			request.Description,
			request.Sku,
			request.Price,
			timeProvider.GetUtcNow());

		if (product.Sku != previousSku
			&& await repository.SkuExistsAsync(product.Sku, id, cancellationToken))
		{
			throw new DuplicateSkuException(product.Sku);
		}

		await repository.UpdateAsync(product, cancellationToken);

		return ProductResponse.From(product);
	}
}
