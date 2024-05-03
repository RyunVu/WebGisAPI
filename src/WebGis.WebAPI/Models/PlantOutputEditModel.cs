using Microsoft.EntityFrameworkCore;
using WebGis.Core.Entities;

namespace WebGis.WebAPI.Models
{
	public class PlantOutputEditModel
	{
		public int Quantity { get; set; }

		public string Unit { get; set; }
		public string UrlSlug { get; set; }

		private DateTime _time;
		public DateTime Time
		{
			get => _time;
			set => _time = DateTime.SpecifyKind(value, DateTimeKind.Utc);
		}

		public Guid CommuneId { get; set; }
		public Guid PlantId { get; set; }

	}
}
