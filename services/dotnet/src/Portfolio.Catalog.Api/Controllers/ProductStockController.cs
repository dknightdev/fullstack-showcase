
using Microsoft.AspNetCore.Mvc;
using Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.UseCases.Products;

namespace Portfolio.Catalog.Api.Controllers;

/// <summary>Administra las operaciones de inventario de los productos.</summary>
[ApiController]
[Route("api/products/{id:int}/stock")]
[Produces("application/json")]
[Tags("Product Stock")]
public sealed class ProductStockController(
	SetProductStockUseCase setProductStockUseCase,
	IncreaseProductStockUseCase increaseProductStockUseCase,
	DecreaseProductStockUseCase decreaseProductStockUseCase) : ControllerBase
{
	/// <summary>Establece la cantidad absoluta de inventario de un producto.</summary>
	/// <param name="id">Identificador del producto.</param>
	/// <param name="request">Nueva cantidad de inventario.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="204">Inventario actualizado.</response>
	/// <response code="400">Cantidad inválida.</response>
	/// <response code="404">El producto no existe.</response>
	/// <response code="409">Conflicto con las reglas de negocio o concurrencia.</response>
	[HttpPatch]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
	public async Task<IActionResult> SetStock(
		int id,
		[FromBody] SetProductStockRequest request,
		CancellationToken cancellationToken)
	{
		await setProductStockUseCase.ExecuteAsync(id, request, cancellationToken);

		return NoContent();
	}

	/// <summary>Incrementa el inventario de un producto.</summary>
	/// <param name="id">Identificador del producto.</param>
	/// <param name="request">Cantidad que se agregará al inventario.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="204">Inventario incrementado.</response>
	/// <response code="400">Cantidad inválida.</response>
	/// <response code="404">El producto no existe.</response>
	/// <response code="409">Conflicto con las reglas de negocio o concurrencia.</response>
	[HttpPost("increase")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
	public async Task<IActionResult> IncreaseStock(
		int id,
		[FromBody] ChangeProductStockRequest request,
		CancellationToken cancellationToken)
	{
		await increaseProductStockUseCase.ExecuteAsync(id, request, cancellationToken);

		return NoContent();
	}

	/// <summary>Disminuye el inventario de un producto.</summary>
	/// <param name="id">Identificador del producto.</param>
	/// <param name="request">Cantidad que se descontará del inventario.</param>
	/// <param name="cancellationToken">Cancelación de la solicitud.</param>
	/// <response code="204">Inventario disminuido.</response>
	/// <response code="400">Cantidad inválida.</response>
	/// <response code="404">El producto no existe.</response>
	/// <response code="409">Conflicto con las reglas de negocio o concurrencia.</response>
	[HttpPost("decrease")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
	[ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
	public async Task<IActionResult> DecreaseStock(
		int id,
		[FromBody] ChangeProductStockRequest request,
		CancellationToken cancellationToken)
	{
		await decreaseProductStockUseCase.ExecuteAsync(id, request, cancellationToken);

		return NoContent();
	}
}
