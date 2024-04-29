namespace WebGis.WebAPI.Models
{
	public class PlantFilterModel : PagingModel
	{
		public string Keyword { get; set; }

		public bool? Actived { get; set; }
    }
}
