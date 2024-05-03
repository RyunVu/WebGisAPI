using WebGis.Core.Contracts;

namespace WebGis.Core.Entities
{
	public class PlantOutput : IEntity
	{
		public Guid Id { get; set; }
		public int Quantity { get; set; }
		public string UrlSlug { get; set; }
		public string Unit { get; set; }

		private DateTime _time;
		public DateTime Time
		{
			get => _time;
			set => _time = DateTime.SpecifyKind(value, DateTimeKind.Utc);
		}
		public bool Actived { get; set; }

		//*************** include object ***************
		public Guid PlantId { get; set; }
		public Plant Plant { get; set; }

		public Guid CommuneId { get; set; }
		public Commune Commune { get; set; }

	}
}
