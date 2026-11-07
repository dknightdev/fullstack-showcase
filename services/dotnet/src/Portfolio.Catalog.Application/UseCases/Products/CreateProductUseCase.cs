using Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.Exceptions;
using Portfolio.Catalog.Application.Interfaces;
using Portfolio.Catalog.Domain.Products;

namespace Portfolio.Catalog.Application.UseCases.Products;

/// <summary>
/// Caso de uso para crear un producto.
/// </summary>
public sealed class CreateProductUseCase(
	IProductRepository repository,
	TimeProvider timeProvider)
{
	public async Task<ProductResponse> ExecuteAsync(
		CreateProductRequest request,
		CancellationToken cancellationToken)
	{
		var product = Product.Create(
			request.Name,
			request.Description,
			request.Sku,
			request.Price,
			request.StockQuantity,
			timeProvider.GetUtcNow());

		if (await repository.SkuExistsAsync(product.Sku, null, cancellationToken))
		{
			throw new DuplicateSkuException(product.Sku);
		}

		await repository.AddAsync(product, cancellationToken);

		return ProductResponse.From(product);
	}
}
