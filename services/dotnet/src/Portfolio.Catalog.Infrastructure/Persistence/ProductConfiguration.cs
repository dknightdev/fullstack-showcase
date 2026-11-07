using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Catalog.Domain.Products;

namespace Portfolio.Catalog.Infrastructure.Persistence;

internal sealed class ProductConfiguration : IEntityTypeConfiguration<Product>
{
	public void Configure(EntityTypeBuilder<Product> builder)
	{
		builder.ToTable("products", tableBuilder =>
		{
			tableBuilder.HasCheckConstraint("ck_products_price_positive", "price > 0");
			tableBuilder.HasCheckConstraint(
				"ck_products_stock_range",
				$"stock_quantity >= 0 AND stock_quantity <= {Product.MaxStockQuantity}");
		});

		builder.HasKey(product => product.Id).HasName("pk_products");

		builder.Property(product => product.Id)
			.HasColumnName("id")
			.UseIdentityByDefaultColumn();

		builder.Property(product => product.Name)
			.HasColumnName("name")
			.HasMaxLength(Product.NameMaxLength)
			.IsRequired();

		builder.Property(product => product.Description)
			.HasColumnName("description")
			.HasMaxLength(Product.DescriptionMaxLength);

		builder.Property(product => product.Sku)
			.HasColumnName("sku")
			.HasMaxLength(Product.SkuMaxLength)
			.IsRequired();

		builder.Property(product => product.Price)
			.HasColumnName("price")
			.HasPrecision(12, 2);

		builder.Property(product => product.StockQuantity).HasColumnName("stock_quantity");
		builder.Property(product => product.IsActive).HasColumnName("is_active");
		builder.Property(product => product.CreatedAt).HasColumnName("created_at");
		builder.Property(product => product.UpdatedAt).HasColumnName("updated_at");


		builder.Property<uint>("Version").IsRowVersion();

		builder.HasIndex(product => product.Sku)
			.IsUnique()
			.HasDatabaseName("ix_products_sku");
	}
}
