using WebGis.Core.Contracts;

namespace WebGis.Core.Entities
{
	public class Commune : IEntity
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string UrlSlug { get; set; }
		public float Area { get; set; }
		public bool Actived { get; set; }

		//*************** include object ***************
		public Guid DistrictId { get; set; }
		public District District { get; set; }
		public IList<PlantInCommnune> PlantsInCommune { get; set; }

	}
}
