using WebGis.Core.Dto;

namespace WebGis.WebAPI.Models
{
	public class PlantDto
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public string UrlSlug { get; set; }
		public bool Actived { get; set; }
		public CategoryItem Category { get; set; }
	}
}
