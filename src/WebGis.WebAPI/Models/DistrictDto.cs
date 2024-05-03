namespace WebGis.WebAPI.Models
{
	public class DistrictDto
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string UrlSlug { get; set; }
		public string Description { get; set; }
		public bool Actived { get; set; }

	}
}
