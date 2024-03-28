using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebGis.Core.Entities;

namespace WebGis.Data.Mappings
{
	public class PlantInCommuneMap : IEntityTypeConfiguration<PlantInCommnune>
	{
		public void Configure(EntityTypeBuilder<PlantInCommnune> builder)
		{
			builder.ToTable("Plants_Commnunes");

			builder.HasKey(x => new
			{
				x.PlantId,
				x.CommuneId
			});

			builder.HasOne(p => p.Plant)
				.WithMany(l => l.PlantInCommnunes)
				.HasForeignKey(p => p.PlantId)
				.HasConstraintName("FK_Plant_Communes")
				.OnDelete(DeleteBehavior.Cascade);

			builder.HasOne(c => c.Commune)
				.WithMany(h => h.PlantsInCommune)
				.HasForeignKey(c => c.CommuneId)
				.HasConstraintName("FK_Plants_Commune")
				.OnDelete(DeleteBehavior.Cascade);
		}
	}
}
