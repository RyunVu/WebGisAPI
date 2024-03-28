using WebGis.Core.Contracts;

namespace WebGis.Core.Entities
{
	public class PlantOutput : IEntity
	{
		public Guid Id { get; set; }
		public int Quantity { get; set; }
		public string UrlSlug { get; set; }
		public DateTime Time { get; set; }
		public bool Actived { get; set; }

		//*************** include object ***************
		public Guid PlantId { get; set; }
		public Plant Plant { get; set; }
	}
}
