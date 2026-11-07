namespace Portfolio.Catalog.Application.Common;

public sealed record PagedResult<T>(
	IReadOnlyList<T> Items,
	int CurrentPage,
	int PageSize,
	int TotalCount,
	int TotalPages
);
