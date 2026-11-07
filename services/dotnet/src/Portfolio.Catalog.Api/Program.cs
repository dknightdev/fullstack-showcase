using System.Text.Json.Serialization;
using Portfolio.Catalog.Api.Configuration;
using Portfolio.Catalog.Api.Middleware;
using Portfolio.Catalog.Application;
using Portfolio.Catalog.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services
	.AddControllers()
	.AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.ConfigureHttpJsonOptions(options =>
{
	options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddProblemDetails(options =>
	options.CustomizeProblemDetails = context =>
		context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier);

builder.Services.AddExceptionHandler<ApiExceptionHandler>();

builder.Services.AddCatalogOpenApi();
builder.Services.AddHealthChecks();

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddCatalogApplication();
builder.Services.AddCatalogInfrastructure();

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
	app.UseSwaggerUI(options =>
	{
		options.SwaggerEndpoint($"/openapi/{OpenApiConfiguration.DocumentName}.json", "Portfolio Catalog API v1");
		options.RoutePrefix = "swagger";
	});
}

app.MapControllers();
app.MapHealthChecks("/health").WithTags("Health");

app.Run();
