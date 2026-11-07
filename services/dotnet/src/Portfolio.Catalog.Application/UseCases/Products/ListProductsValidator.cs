using Portfolio.Catalog.Application.DTOs.Products;
using Portfolio.Catalog.Application.Exceptions;
using Portfolio.Catalog.Application.Interfaces;

namespace Portfolio.Catalog.Application.UseCases.Products;

/// <summary>
/// Valida y normaliza los parámetros del listado de productos.
/// </summary>
public static class ListProductsValidator
{
	public static ProductSearchCriteria ValidateAndNormalize(ListProductsRequest request)
	{
		var errors = new Dictionary<string, string[]>();

		if (request.Page < 1)
		{
			errors["page"] = ["page debe ser mayor o igual que 1."];
		}

		if (request.PageSize is < 1 or > ListProductsRequest.MaxPageSize)
		{
			errors["pageSize"] = [$"pageSize debe estar entre 1 y {ListProductsRequest.MaxPageSize}."];
		}

		var search = string.IsNullOrWhiteSpace(request.Search) ? null : request.Search.Trim();

		if (search?.Length > ListProductsRequest.SearchMaxLength)
		{
			errors["search"] = [$"search no puede superar {ListProductsRequest.SearchMaxLength} caracteres."];
		}

		if (!Enum.IsDefined(request.SortBy))
		{
			errors["sortBy"] = [$"sortBy debe ser uno de: {string.Join(", ", Enum.GetNames<ProductSortField>())}."];
		}

		if (!Enum.IsDefined(request.SortDirection))
		{
			errors["sortDirection"] = [$"sortDirection debe ser uno de: {string.Join(", ", Enum.GetNames<ProductSortDirection>())}."];
		}

		if (errors.Count > 0)
		{
			throw new ApplicationValidationException(errors);
		}

		return new ProductSearchCriteria(
			request.Page,
			request.PageSize,
			search,
			request.IsActive ?? true,
			request.SortBy,
			request.SortDirection);
	}
}
