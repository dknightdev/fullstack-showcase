using System.Text.RegularExpressions;
using Portfolio.Catalog.Domain.Exceptions;

namespace Portfolio.Catalog.Domain.Products;

/// <summary>
/// Producto del catálogo. El inventario forma parte de la entidad para que
/// los cambios de información y existencias se puedan controlar desde el mismo agregado.
/// </summary>
public sealed partial class Product
{
	public const int NameMaxLength = 200;
	public const int DescriptionMaxLength = 2000;
	public const int SkuMaxLength = 64;
	public const int MaxStockQuantity = 5000;
	public const decimal PriceMaxValue = 9_999_999_999.99m;

	public int Id { get; private set; }
	public string Name { get; private set; } = string.Empty;
	public string? Description { get; private set; }
	public string Sku { get; private set; } = string.Empty;
	public decimal Price { get; private set; }
	public int StockQuantity { get; private set; }
	public bool IsActive { get; private set; }
	public DateTimeOffset CreatedAt { get; private set; }
	public DateTimeOffset UpdatedAt { get; private set; }

	private Product() {}


	/// <summary>
	/// Crea un producto nuevo. Los productos comienzan activos.
	/// </summary>
	public static Product Create(
		string? name,
		string? description,
		string? sku,
		decimal price,
		int initialStockQuantity,
		DateTimeOffset now)
	{
		ValidateStockQuantity(initialStockQuantity);

		var product = new Product();

		product.ApplyDetails(name, description, sku, price);
		product.StockQuantity = initialStockQuantity;
		product.IsActive = true;
		product.CreatedAt = now;
		product.UpdatedAt = now;

		return product;
	}

	/// <summary>
	/// Actualiza la información del producto sin modificar sus existencias ni su estado.
	/// </summary>
	public void UpdateDetails(
		string? name,
		string? description,
		string? sku,
		decimal price,
		DateTimeOffset now)
	{
		ApplyDetails(name, description, sku, price);
		UpdatedAt = now;
	}

	/// <summary>
	/// Establece la cantidad absoluta de existencias.
	/// Útil para ajustes o conciliaciones de inventario.
	/// </summary>
	public void SetStock(int quantity, DateTimeOffset now)
	{
		ValidateStockQuantity(quantity);

		if (StockQuantity == quantity)
		{
			return;
		}

		StockQuantity = quantity;
		UpdatedAt = now;
	}

	/// <summary>
	/// Incrementa las existencias del producto.
	/// </summary>
	public void IncreaseStock(int quantity, DateTimeOffset now)
	{
		ValidateMovementQuantity(quantity);

		if (quantity > MaxStockQuantity - StockQuantity)
		{
			throw new BusinessRuleViolationException(
				"La cantidad solicitada supera el límite máximo de inventario.");
		}

		StockQuantity += quantity;
		UpdatedAt = now;
	}

	/// <summary>
	/// Disminuye las existencias del producto.
	/// No permite retirar una cantidad superior al inventario disponible.
	/// </summary>
	public void DecreaseStock(int quantity, DateTimeOffset now)
	{
		ValidateMovementQuantity(quantity);

		if (quantity > StockQuantity)
		{
			throw new BusinessRuleViolationException(
				$"Inventario insuficiente. Existencias disponibles: {StockQuantity}.");
		}

		StockQuantity -= quantity;
		UpdatedAt = now;
	}

	/// <summary>
	/// Activa el producto.
	/// </summary>
	public void Activate(DateTimeOffset now)
	{
		if (IsActive)
		{
			return;
		}

		IsActive = true;
		UpdatedAt = now;
	}

	/// <summary>
	/// Desactiva el producto sin eliminarlo ni modificar sus existencias.
	/// </summary>
	public void Deactivate(DateTimeOffset now)
	{
		if (!IsActive)
		{
			return;
		}

		IsActive = false;
		UpdatedAt = now;
	}

	/// <summary>
	/// Verifica si el producto puede eliminarse físicamente.
	/// No se permite eliminar productos que tengan existencias.
	/// </summary>
	public void EnsureCanBeDeleted()
	{
		if (StockQuantity > 0)
		{
			throw new BusinessRuleViolationException(
				$"El producto tiene {StockQuantity} unidades en inventario. Ajuste el stock a 0 antes de eliminarlo.");
		}
	}

	private void ApplyDetails(
		string? name,
		string? description,
		string? sku,
		decimal price)
	{
		var normalizedName = (name ?? string.Empty).Trim();
		var normalizedDescription = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
		var normalizedSku = (sku ?? string.Empty).Trim().ToUpperInvariant();

		var errors = new Dictionary<string, List<string>>();

		void AddError(string field, string message)
		{
			if (!errors.TryGetValue(field, out var messages))
			{
				messages = [];
				errors[field] = messages;
			}

			messages.Add(message);
		}

		if (normalizedName.Length == 0)
		{
			AddError("name", "El nombre es obligatorio.");
		}
		else if (normalizedName.Length > NameMaxLength)
		{
			AddError("name", $"El nombre no puede superar {NameMaxLength} caracteres.");
		}

		if (normalizedDescription?.Length > DescriptionMaxLength)
		{
			AddError("description", $"La descripción no puede superar {DescriptionMaxLength} caracteres.");
		}

		if (normalizedSku.Length == 0)
		{
			AddError("sku", "El SKU es obligatorio.");
		}
		else if (normalizedSku.Length > SkuMaxLength)
		{
			AddError("sku", $"El SKU no puede superar {SkuMaxLength} caracteres.");
		}
		else if (!SkuPattern().IsMatch(normalizedSku))
		{
			AddError("sku", "El SKU solo admite letras, números, guiones y guiones bajos. Debe comenzar con una letra o un número.");
		}

		if (price <= 0)
		{
			AddError("price", "El precio debe ser mayor que cero.");
		}
		else if (price > PriceMaxValue || decimal.Round(price, 2) != price)
		{
			AddError("price", $"El precio admite como máximo 2 decimales y un valor de {PriceMaxValue:0.##}.");
		}

		if (errors.Count > 0)
		{
			throw new DomainValidationException(
				errors.ToDictionary(pair => pair.Key, pair => pair.Value.ToArray()));
		}

		Name = normalizedName;
		Description = normalizedDescription;
		Sku = normalizedSku;
		Price = price;
	}

	private static void ValidateStockQuantity(int quantity)
	{
		if (quantity < 0 || quantity > MaxStockQuantity)
		{
			throw new DomainValidationException(
				new Dictionary<string, string[]>
				{
					["stockQuantity"] = [$"El inventario debe estar entre 0 y {MaxStockQuantity} unidades."]
				});
		}
	}

	private static void ValidateMovementQuantity(int quantity)
	{
		if (quantity <= 0)
		{
			throw new DomainValidationException(
				new Dictionary<string, string[]>
				{
					["quantity"] = ["La cantidad debe ser mayor que cero."]
				});
		}
	}

	[GeneratedRegex("^[A-Z0-9][A-Z0-9_-]*$")]
	private static partial Regex SkuPattern();
}
