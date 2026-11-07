namespace Portfolio.Catalog.Application.Exceptions;


public sealed class ApplicationValidationException(IReadOnlyDictionary<string, string[]> errors)
	: Exception("Uno o más parámetros no son válidos.")
{
	public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
}


public sealed class ProductNotFoundException(int id)
	: Exception($"No existe un producto con id {id}.");



public abstract class ConflictException(string message) : Exception(message);

public sealed class DuplicateSkuException(string sku)
	: ConflictException($"Ya existe un producto con el SKU '{sku}'.");

public sealed class ConcurrencyConflictException()
	: ConflictException("El producto fue modificado por otra operación. Consulte su versión actual y reintente.");
