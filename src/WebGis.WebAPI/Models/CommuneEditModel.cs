namespace WebGis.WebAPI.Models
{
	public class CommuneEditModel
	{
		public string Name { get; set; }
		public string UrlSlug { get; set; }
		public string Description { get; set; }
		public float Area { get; set; }
		public Guid DistrictId { get; set; }
	}
}
