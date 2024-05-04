namespace WebGis.WebAPI.Models
{
	public class PlantOutputFilterModel : PagingModel
	{
        public string Keyword { get; set; }
		public int? Month { get; set; }
		public int? Year { get; set; }
		public bool? Actived { get; set; }
		public Guid? CommuneId { get; set; }
		public Guid? PlantId { get; set; }

	}
}
