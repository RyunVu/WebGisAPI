namespace WebGis.WebAPI.Models
{
	public class PlantEditModel
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public string UrlSlug { get; set; }
		public bool Actived { get; set; }
		public Guid CategoryId { get; set; }
	}
}
