using WebGis.Core.Contracts;

namespace WebGis.Core.Entities
{
	public class Plant : IEntity
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string UrlSlug { get; set; }
		public bool Actived { get; set; }

		//*************** include object ***************
		public Guid CategoryId { get; set; }
		public Category Category { get; set; }
		public IList<PlantInCommnune> PlantInCommnunes { get; set; }
		public IList<PlantOutput> PlantOutputs { get; set; }
	}
}
