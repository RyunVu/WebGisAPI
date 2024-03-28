namespace WebGis.Core.Entities
{
	public class PlantInCommnune
	{
		public Guid PlantId { get; set; }
        public Guid CommuneId { get; set; }
		//********** include object ********** 
		public Plant Plant { get; set; }
		public Commune Commune { get; set; }
	}
}
