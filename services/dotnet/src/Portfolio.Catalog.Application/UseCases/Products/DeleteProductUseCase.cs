using Portfolio.Catalog.Application.Exceptions;
using Portfolio.Catalog.Application.Interfaces;

namespace Portfolio.Catalog.Application.UseCases.Products;

/// <summary>
/// Caso de uso para eliminar un producto.
/// </summary>
public sealed class DeleteProductUseCase(IProductRepository repository)
{
	public async Task ExecuteAsync(
		int id,
		CancellationToken cancellationToken)
	{
		var product = await repository.GetByIdAsync(id, cancellationToken)
			?? throw new ProductNotFoundException(id);

		product.EnsureCanBeDeleted();

		await repository.DeleteAsync(product, cancellationToken);
	}
}
