namespace WebGis.WebAPI.Models
{
	public class DistrictEditModel
	{
		public string Name { get; set; }
		public string UrlSlug { get; set; }
		public string Description { get; set; }

		public Guid DistrictId { get; set; }
	}
}
