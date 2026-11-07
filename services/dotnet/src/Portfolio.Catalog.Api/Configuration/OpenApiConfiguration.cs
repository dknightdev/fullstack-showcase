using Microsoft.OpenApi;

namespace Portfolio.Catalog.Api.Configuration;

public static class OpenApiConfiguration
{
	public const string DocumentName = "v1";

	public static IServiceCollection AddCatalogOpenApi(this IServiceCollection services)
	{
		services.AddOpenApi(DocumentName, options =>
		{
			options.AddDocumentTransformer((document, _, _) =>
			{
				document.Info = new OpenApiInfo
				{
					Title = "Portfolio Catalog API",
					Version = "v1",
					Description = "API de catálogo de productos e inventario del proyecto Full Stack Showcase."
				};

				return Task.CompletedTask;
			});
		});

		return services;
	}
}
