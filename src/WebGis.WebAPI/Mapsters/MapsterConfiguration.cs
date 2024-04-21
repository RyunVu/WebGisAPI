using Mapster;
using WebGis.Core.Dto;
using WebGis.Core.Entities;
using WebGis.WebAPI.Models;

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

			config.NewConfig<Commune, CommuneItem>();

			config.NewConfig<Plant, PlantDto>();
			config.NewConfig<Plant, PlantItem>();

			config.NewConfig<PlantOutput, PlantOutputDto>();
			config.NewConfig<PlantOutputDto, PlantOutput>();
			config.NewConfig<PlantOutput, PlantOutputCommuneItem>();
			config.NewConfig<PlantOutput, PlantOutputPlantItem>();
		}





	}
}
