using Microsoft.AspNetCore.Mvc;
using Portfolio.Catalog.Infrastructure.Persistence;

namespace Portfolio.Catalog.Api.Controllers;

/// <summary>Health check endpoints para monitoreo de disponibilidad.</summary>
[ApiController]
[Route("health")]
[Produces("application/json")]
[Tags("Health")]
public sealed class HealthController(CatalogDbContext dbContext) : ControllerBase
{
	/// <summary>Verifica que el API esté ejecutándose.</summary>
	/// <remarks>
	/// Endpoint de health check simple que solo verifica si el servicio está activo.
	/// Retorna 200 OK si el API está funcionando.
	/// </remarks>
	/// <response code="200">API está saludable.</response>
	[HttpGet]
	[ProducesResponseType<HealthResponse>(StatusCodes.Status200OK)]
	public ActionResult<HealthResponse> GetHealth() =>
		Ok(new HealthResponse { Status = "ok" });

	/// <summary>Verifica que el API y la base de datos estén listos.</summary>
	/// <remarks>
	/// Endpoint de readiness check que verifica la conectividad con PostgreSQL.
	/// Usa un timeout de 3 segundos para la verificación de conexión.
	/// Retorna 200 OK si todo está disponible, 503 si la base de datos no responde.
	/// </remarks>
	/// <response code="200">API y base de datos están listos.</response>
	/// <response code="503">La base de datos no está disponible.</response>
	[HttpGet("ready")]
	[ProducesResponseType<HealthReadyResponse>(StatusCodes.Status200OK)]
	[ProducesResponseType<HealthReadyResponse>(StatusCodes.Status503ServiceUnavailable)]
	public async Task<ActionResult<HealthReadyResponse>> GetReady(
		CancellationToken cancellationToken)
	{
		try
		{
			var canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);

			if (!canConnect)
			{
				return StatusCode(
					StatusCodes.Status503ServiceUnavailable,
					new HealthReadyResponse
					{
						Status = "unavailable",
						Database = "disconnected"
					});
			}

			return Ok(new HealthReadyResponse
			{
				Status = "ok",
				Database = "connected"
			});
		}
		catch
		{
			return StatusCode(
				StatusCodes.Status503ServiceUnavailable,
				new HealthReadyResponse
				{
					Status = "unavailable",
					Database = "disconnected"
				});
		}
	}
}

public sealed record HealthResponse
{
	public required string Status { get; set; }
}

public sealed record HealthReadyResponse
{
	public required string Status { get; set; }
	public required string Database { get; set; }
}
