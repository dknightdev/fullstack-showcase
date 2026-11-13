namespace Portfolio.Catalog.Api.Configuration;

public sealed class SecurityOptions
{
	public CorsOptions Cors { get; set; } = new();
	public RateLimitingOptions RateLimiting { get; set; } = new();
	public RequestLimitsOptions RequestLimits { get; set; } = new();
}

public sealed class CorsOptions
{
	public string[] AllowedOrigins { get; set; } = [];
}

public sealed class RateLimitingOptions
{
	public int MaxRequests { get; set; } = 100;
	public int WindowMinutes { get; set; } = 1;
}

public sealed class RequestLimitsOptions
{
	public long MaxBodySizeBytes { get; set; } = 1048576;
}
