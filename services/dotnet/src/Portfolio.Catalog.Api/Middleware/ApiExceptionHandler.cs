using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Catalog.Application.Exceptions;
using Portfolio.Catalog.Domain.Exceptions;

namespace Portfolio.Catalog.Api.Middleware;

/// <summary>Traduce excepciones a respuestas ProblemDetails sin filtrar detalles internos.</summary>
public sealed class ApiExceptionHandler(
	IProblemDetailsService problemDetailsService,
	ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
	public async ValueTask<bool> TryHandleAsync(
		HttpContext httpContext,
		Exception exception,
		CancellationToken cancellationToken)
	{
		if (exception is OperationCanceledException && httpContext.RequestAborted.IsCancellationRequested)
		{
			return true;
		}

		var problem = exception switch
		{
			DomainValidationException validation => Validation(validation.Errors),
			ApplicationValidationException validation => Validation(validation.Errors),
			ProductNotFoundException notFound => Create(StatusCodes.Status404NotFound, "Recurso no encontrado", notFound.Message),
			BusinessRuleViolationException rule => Create(StatusCodes.Status409Conflict, "Regla de negocio incumplida", rule.Message),
			ConflictException conflict => Create(StatusCodes.Status409Conflict, "Conflicto", conflict.Message),
			_ => null
		};

		if (problem is null)
		{
			logger.LogError(exception, "Error no controlado procesando {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);

			problem = Create(
				StatusCodes.Status500InternalServerError,
				"Error interno del servidor",
				"Ocurrió un error inesperado. Intente nuevamente más tarde.");
		}

		httpContext.Response.StatusCode = problem.Status ?? StatusCodes.Status500InternalServerError;

		return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
		{
			HttpContext = httpContext,
			ProblemDetails = problem
		});
	}

	private static ProblemDetails Create(int status, string title, string detail) => new()
	{
		Status = status,
		Title = title,
		Detail = detail
	};

	private static ValidationProblemDetails Validation(IReadOnlyDictionary<string, string[]> errors) => new(
		errors.ToDictionary(pair => pair.Key, pair => pair.Value))
	{
		Status = StatusCodes.Status400BadRequest,
		Title = "Solicitud inválida"
	};
}
