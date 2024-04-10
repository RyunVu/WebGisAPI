using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebGis.Core.Entities;

namespace WebGis.Data.Mappings
{
	public class CommuneMap : IEntityTypeConfiguration<Commune>
	{
		public void Configure(EntityTypeBuilder<Commune> builder)
		{
			builder.ToTable("Communes");

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

			builder.HasOne(d => d.District)
					.WithMany(c => c.Communes)
					.HasForeignKey(a => a.DistrictId)
					.HasConstraintName("FK_Commnunes_District")
					.OnDelete(DeleteBehavior.Cascade);
		}
	}
}
