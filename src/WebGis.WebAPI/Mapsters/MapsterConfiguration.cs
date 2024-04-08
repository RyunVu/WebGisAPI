using Mapster;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using Newtonsoft.Json;
using GeoJSON.Net;
using GeoJSON.Net.Feature;
using System.Collections.Generic;
using WebGis.Core.Dto;
using WebGis.Core.Entities;
using WebGis.WebAPI.Models;
using GeoJSON.Net.Geometry;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebGis.WebAPI.Mapsters
{
	public class MapsterConfiguration : IRegister
	{
		public void Register(TypeAdapterConfig config)
		{
			config.NewConfig<District, DistrictDto>();
			config.NewConfig<District, DistrictItem>();

			config.NewConfig<Category, CategoryDto>();
			config.NewConfig<Category, CategoryItem>();

			config.NewConfig<Commune, CommuneDto>()
			.Map(dest => dest.Geometry, src => src.Geometry);

			//config.NewConfig<Feature, GeoJSONObject>()
			//	.Map(dest => dest, src => src.Geometry);

			config.NewConfig<Commune, CommuneItem>();

			config.NewConfig<Plant, PlantDto>();
			config.NewConfig<Plant, PlantItem>();

			config.NewConfig<PlantOutput, PlantOutputDto>();
		}

		//private static Feature ConvertGeometryToGeoJSONFeature(Geometry geometry)
		//{
		//	var writer = new GeoJsonWriter();
		//	var geoJsonString = writer.Write(geometry);

		//	var reader = new GeoJsonReader();
		//	var geoJsonGeometry = reader.Read<IGeometryObject>(geoJsonString);

		//	var feature = new Feature(geoJsonGeometry, new Dictionary<string, object>());

		//	return feature;
		//}


		private string ConvertGeometryToGeoJSONString(Geometry geometry)
		{
			var geometryData = geometry;
			GeoJsonWriter _geoJsonWriter = new GeoJsonWriter();
			var str = _geoJsonWriter.Write(geometryData);
			return str;
		}




	}
}
