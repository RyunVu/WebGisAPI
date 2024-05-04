namespace WebGis.WebAPI.Models
{
	public class CommuneFilterModel : PagingModel
	{
		public string Keyword { get; set; }
		public bool? Actived { get; set; }
		public Guid? DistrictId { get; set; }

	}
}
