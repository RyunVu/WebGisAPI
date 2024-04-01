using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebGis.Core.Entities;

namespace WebGis.Data.Mappings
{
	public class PlantOutputMap : IEntityTypeConfiguration<PlantOutput>
	{
		public void Configure(EntityTypeBuilder<PlantOutput> builder)
		{
			builder.ToTable("PlantOutputs");

			builder.HasKey(x => x.Id);

			builder.Property(a => a.Quantity)
					.IsRequired()
					.HasDefaultValue(0);

			builder.Property(a => a.UrlSlug)
					.IsRequired()
					.HasMaxLength(100);

			builder.Property(a => a.Time)
					.HasColumnType("datetime");

			builder.Property(a => a.Actived)
					.IsRequired()
					.HasDefaultValue(true);

			builder.HasOne(p => p.Plant)
					.WithMany(c => c.PlantOutputs)
					.HasForeignKey(p => p.PlantId)
					.HasConstraintName("FK_Plant_PlantOutputs")
					.OnDelete(DeleteBehavior.Cascade);

			builder.HasOne(p => p.Commune)
					.WithMany(c => c.PlantOutputs)
					.HasForeignKey(p => p.CommuneId)
					.HasConstraintName("FK_Commune_PlantOutputs")
					.OnDelete(DeleteBehavior.Cascade);
		}
	}
}
