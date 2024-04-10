using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebGis.Core.Entities;

namespace WebGis.Data.Mappings
{
	public class CategoryMap : IEntityTypeConfiguration<Category>
	{
		public void Configure(EntityTypeBuilder<Category> builder)
		{
			builder.ToTable("Categories");

			builder.HasKey(x => x.Id);

			builder.Property(a => a.Name)
					.IsRequired()
					.HasMaxLength(100);

			builder.Property(a => a.UrlSlug)
					.IsRequired()
					.HasMaxLength(100);

			builder.Property(a => a.Description)
				 .HasMaxLength(5000);

			builder.Property(a => a.Actived)
					.IsRequired()
					.HasDefaultValue(true);
		}
	}
}
