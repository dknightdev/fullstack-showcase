namespace Portfolio.Catalog.Domain.Exceptions;

/// <summary>Base de las excepciones que expresan violaciones de reglas del dominio.</summary>
public abstract class DomainException(string message) : Exception(message);


/// <summary>Uno o más datos de entrada incumplen los invariantes de la entidad.</summary>
public sealed class DomainValidationException(IReadOnlyDictionary<string, string[]> errors)
	: DomainException("Uno o más datos no cumplen las reglas del dominio.")
{
	public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
}

/// <summary>La operación es válida en forma, pero el estado actual del negocio la impide.</summary>
public sealed class BusinessRuleViolationException(string message) : DomainException(message);
