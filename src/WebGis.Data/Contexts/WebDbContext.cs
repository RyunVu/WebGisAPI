using Microsoft.EntityFrameworkCore;
using WebGis.Core.Entities;

namespace WebGis.Data.Contexts
{
	public class WebDbContext : DbContext
	{

		public DbSet<District> Districts { get; set; }
		public DbSet<Commune> Communes { get; set; }
		public DbSet<Category> Categories { get; set; }
		public DbSet<Plant> Plants { get; set; }
		public DbSet<PlantInCommnune> PlantsInCommunes { get; set; }
		public DbSet<PlantOutput> PlantOutputs { get; set; }

        public WebDbContext(DbContextOptions<WebDbContext> options) : base(options)
        {
            
        }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.UseSerialColumns();
		}
    }
}
