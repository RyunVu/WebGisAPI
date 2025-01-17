﻿using WebGis.Core.Contracts;

namespace WebGis.Core.Queries
{
	public class PlantOutputQuery
	{
		public string Keyword { get; set; }
		public bool? Actived { get; set; }
		public int? Month { get; set; }
		public int? Year { get; set; }
		public Guid? CommuneId { get; set; }
		public Guid? PlantId { get; set; }

	}
}
