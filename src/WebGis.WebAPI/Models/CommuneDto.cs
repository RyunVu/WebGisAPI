namespace WebGis.WebAPI.Models
{
	public class CommuneDto
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string UrlSlug { get; set; }
		public float Area { get; set; }
	}
}
