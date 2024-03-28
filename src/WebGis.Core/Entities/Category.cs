using WebGis.Core.Contracts;

namespace WebGis.Core.Entities
{
	public class Category : IEntity
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string UrlSlug { get; set; }
		public bool Actived { get; set; }

		//*************** include object ***************
		public IList<Plant> Plants { get; set; }
	}
}
