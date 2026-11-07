using Microsoft.Extensions.DependencyInjection;
using Portfolio.Catalog.Application.UseCases.Products;

namespace Portfolio.Catalog.Application;

public static class DependencyInjection
{
	public static IServiceCollection AddCatalogApplication(this IServiceCollection services)
	{
		services.AddScoped<CreateProductUseCase>();
		services.AddScoped<GetProductUseCase>();
		services.AddScoped<ListProductsUseCase>();
		services.AddScoped<UpdateProductUseCase>();
		services.AddScoped<SetProductStockUseCase>();
		services.AddScoped<IncreaseProductStockUseCase>();
		services.AddScoped<DecreaseProductStockUseCase>();
		services.AddScoped<ActivateProductUseCase>();
		services.AddScoped<DeactivateProductUseCase>();
		services.AddScoped<DeleteProductUseCase>();

		return services;
	}
}
