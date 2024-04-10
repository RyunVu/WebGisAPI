
using WebGis.Core.Contracts;

namespace WebGis.Core.Entities
{
	public class District : IEntity
	{
		public Guid Id {  get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string UrlSlug { get; set; }
		public bool Actived { get; set; }

		//*************** include object ***************
		public IList<Commune> Communes { get; set; }

	}
}
