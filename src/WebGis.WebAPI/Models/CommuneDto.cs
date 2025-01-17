﻿using WebGis.Core.Dto;

namespace WebGis.WebAPI.Models
{
	public class CommuneDto
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string UrlSlug { get; set; }
		public string Description { get; set; }
		public string Geometry { get; set; }
		public float Area { get; set; }
		public bool Actived { get; set; }
		public DistrictItem District { get; set; }
	}
}
	