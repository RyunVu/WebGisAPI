using WebGis.Core.Dto;

namespace WebGis.WebAPI.Models
{
	public class PlantOutputDto
	{
		public Guid Id { get; set; }
		public int Quantity { get; set; }
		public string Unit { get; set; }
		public string UrlSlug { get; set; }

		private DateTime _time;
		public DateTime Time
		{
			get => _time;
			set => _time = DateTime.SpecifyKind(value, DateTimeKind.Utc);
		}
		public bool Actived { get; set; }
		public CommuneItem Commune { get; set; }
		public PlantItem Plant { get; set; }

	}
}
