
using Microsoft.AspNetCore.Mvc;
using Portfolio.Catalog.Application.Common;
using Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.UseCases.Products;

namespace Portfolio.Catalog.Api.Controllers;

/// <summary>Administra el catálogo de productos.</summary>
[ApiController]
[Route("api/products")]
[Produces("application/json")]
[Tags("Products")]
public sealed class ProductsController(
	ListProductsUseCase listProductsUseCase,
	GetProductUseCase getProductUseCase,
	CreateProductUseCase createProductUseCase,
	UpdateProductUseCase updateProductUseCase,
	ActivateProductUseCase activateProductUseCase,
	DeactivateProductUseCase deactivateProductUseCase,
	DeleteProductUseCase deleteProductUseCase) : ControllerBase
{
	/// <summary>Lista productos con paginación, búsqueda y ordenamiento.</summary>
	/// <remarks>
	/// Por defecto solo devuelve productos activos.
	/// Use <c>isActive=false</c> para consultar los inactivos.
	/// La búsqueda no distingue mayúsculas y aplica sobre nombre o SKU.
	/// </remarks>
	/// <param name="request">Parámetros de consulta del listado.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="200">Página de productos.</response>
	/// <response code="400">Parámetros de consulta inválidos.</response>
	[HttpGet]
	[ProducesResponseType<PagedResult<ProductResponse>>(StatusCodes.Status200OK)]
	[ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
	public async Task<ActionResult<PagedResult<ProductResponse>>> List(
		[FromQuery] ListProductsRequest request,
		CancellationToken cancellationToken) =>
		Ok(await listProductsUseCase.ExecuteAsync(request, cancellationToken));

	/// <summary>Consulta un producto por su identificador.</summary>
	/// <param name="id">Identificador del producto.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="200">Producto encontrado.</response>
	/// <response code="404">El producto no existe.</response>
	[HttpGet("{id:int}")]
	[ProducesResponseType<ProductResponse>(StatusCodes.Status200OK)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
	public async Task<ActionResult<ProductResponse>> GetById(
		int id,
		CancellationToken cancellationToken) =>
		Ok(await getProductUseCase.ExecuteAsync(id, cancellationToken));

	/// <summary>Crea un producto.</summary>
	/// <param name="request">Datos del nuevo producto.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="201">Producto creado. La cabecera Location apunta al recurso.</response>
	/// <response code="400">Datos inválidos.</response>
	/// <response code="409">Ya existe un producto con el mismo SKU.</response>
	[HttpPost]
	[ProducesResponseType<ProductResponse>(StatusCodes.Status201Created)]
	[ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
	public async Task<ActionResult<ProductResponse>> Create(
		[FromBody] CreateProductRequest request,
		CancellationToken cancellationToken)
	{
		var product = await createProductUseCase.ExecuteAsync(request, cancellationToken);

		return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
	}

	/// <summary>Actualiza los datos de un producto.</summary>
	/// <remarks>
	/// Esta operación modifica los datos descriptivos y comerciales del producto.
	/// No modifica el inventario ni el estado de activación.
	/// </remarks>
	/// <param name="id">Identificador del producto.</param>
	/// <param name="request">Nuevos datos del producto.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="200">Producto actualizado.</response>
	/// <response code="400">Datos inválidos.</response>
	/// <response code="404">El producto no existe.</response>
	/// <response code="409">SKU duplicado o conflicto de concurrencia.</response>
	[HttpPut("{id:int}")]
	[ProducesResponseType<ProductResponse>(StatusCodes.Status200OK)]
	[ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
	public async Task<ActionResult<ProductResponse>> Update(
		int id,
		[FromBody] UpdateProductRequest request,
		CancellationToken cancellationToken) =>
		Ok(await updateProductUseCase.ExecuteAsync(id, request, cancellationToken));

	/// <summary>Activa un producto.</summary>
	/// <param name="id">Identificador del producto.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="204">Producto activado.</response>
	/// <response code="404">El producto no existe.</response>
	/// <response code="409">Conflicto de concurrencia.</response>
	[HttpPatch("{id:int}/activate")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
	public async Task<IActionResult> Activate(
		int id,
		CancellationToken cancellationToken)
	{
		await activateProductUseCase.ExecuteAsync(id, cancellationToken);

		return NoContent();
	}

	/// <summary>Desactiva un producto.</summary>
	/// <param name="id">Identificador del producto.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="204">Producto desactivado.</response>
	/// <response code="404">El producto no existe.</response>
	/// <response code="409">Conflicto de concurrencia.</response>
	[HttpPatch("{id:int}/deactivate")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
	public async Task<IActionResult> Deactivate(
		int id,
		CancellationToken cancellationToken)
	{
		await deactivateProductUseCase.ExecuteAsync(id, cancellationToken);

		return NoContent();
	}

	/// <summary>Elimina un producto.</summary>
	/// <remarks>
	/// Un producto con unidades en inventario no puede eliminarse.
	/// Primero debe dejarse su inventario en cero.
	/// </remarks>
	/// <param name="id">Identificador del producto.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="204">Producto eliminado.</response>
	/// <response code="404">El producto no existe.</response>
	/// <response code="409">El producto tiene inventario o existe un conflicto de concurrencia.</response>
	[HttpDelete("{id:int}")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
	public async Task<IActionResult> Delete(
		int id,
		CancellationToken cancellationToken)
	{
		await deleteProductUseCase.ExecuteAsync(id, cancellationToken);

		return NoContent();
	}
}
