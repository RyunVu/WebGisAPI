using NetTopologySuite.Geometries;

namespace WebGis.Core.Dto
{
	public class CommuneItem
	{ 
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string Geometry { get; set; }

	}
}
