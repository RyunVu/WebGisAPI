using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebGis.Core.Entities;

namespace WebGis.Data.Mappings
{
	public class PlantMap : IEntityTypeConfiguration<Plant>
	{
		public void Configure(EntityTypeBuilder<Plant> builder)
		{
			builder.ToTable("Plants");

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

			builder.HasOne(p => p.Category)
					.WithMany(c => c.Plants)
					.HasForeignKey(p => p.CategoryId)
					.HasConstraintName("FK_Plants_Categories")
					.OnDelete(DeleteBehavior.Cascade);
		}
	}
}
