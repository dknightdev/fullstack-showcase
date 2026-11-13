using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Portfolio.Catalog.Api.Configuration;
using Portfolio.Catalog.Api.Middleware;
using Portfolio.Catalog.Application;
using Portfolio.Catalog.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var securityOptions = new SecurityOptions();
builder.Configuration.GetSection("Security").Bind(securityOptions);

builder.Services.Configure<SecurityOptions>(builder.Configuration.GetSection("Security"));

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowedOrigins", policy =>
	{
		if (builder.Environment.IsDevelopment())
		{
			policy.AllowAnyOrigin()
				.WithMethods("GET", "POST", "PUT", "PATCH", "DELETE")
				.WithHeaders("Content-Type", "Accept");
		}
		else
		{
			policy.WithOrigins(securityOptions.Cors.AllowedOrigins)
				.WithMethods("GET", "POST", "PUT", "PATCH", "DELETE")
				.WithHeaders("Content-Type", "Accept");
		}
	});
});

builder.Services.AddRateLimiter(options =>
{
	options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
	{
		var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

		return RateLimitPartition.GetFixedWindowLimiter(clientIp, _ =>
			new FixedWindowRateLimiterOptions
			{
				PermitLimit = securityOptions.RateLimiting.MaxRequests,
				Window = TimeSpan.FromMinutes(securityOptions.RateLimiting.WindowMinutes),
				QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
				QueueLimit = 0
			});
	});

	options.OnRejected = async (context, _) =>
	{
		context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
		context.HttpContext.Response.ContentType = "application/problem+json";

		await context.HttpContext.Response.WriteAsJsonAsync(new
		{
			type = "https://tools.ietf.org/html/rfc6585#section-4",
			title = "Too Many Requests",
			status = 429,
			detail = "Demasiadas solicitudes. Intente más tarde."
		});
	};
});

builder.Services
	.AddControllers()
	.AddJsonOptions(options =>
		options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

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

builder.WebHost.ConfigureKestrel(serverOptions =>
{
	serverOptions.Limits.MaxRequestBodySize = securityOptions.RequestLimits.MaxBodySizeBytes;
});

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

app.UseCors("AllowedOrigins");
app.UseRateLimiter();

if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();

	app.UseSwaggerUI(options =>
	{
		options.DocumentTitle = "Portfolio Catalog API";
		options.SwaggerEndpoint($"/openapi/{OpenApiConfiguration.DocumentName}.json", "Portfolio Catalog API v1");
		options.RoutePrefix = "swagger";
	});
}

app.MapControllers();
app.MapHealthChecks("/health").WithTags("Health");

app.Run();
