namespace WebGis.WebAPI.Models
{
	public class DistrictFilterModel : PagingModel
	{
        public string Keyword { get; set; }

		public bool? Actived { get; set; }
	}
}
