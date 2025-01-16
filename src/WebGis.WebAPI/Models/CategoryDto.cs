namespace WebGis.WebAPI.Models
{
	public class CategoryDto
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string UrlSlug { get; set; }
		public string Description { get; set; }

		public bool Actived { get; set; }
		public int PlantsCount { get; set; }


	}
}
