using Mapster;
using WebGis.Core.Entities;
using WebGis.WebAPI.Models;

namespace WebGis.WebAPI.Mapsters
{
	public class MapsterConfiguration : IRegister
	{
		public void Register(TypeAdapterConfig config)
		{
			config.NewConfig<District, DistrictDto>();

			config.NewConfig<Category, CategoryDto>();
		}
	}
}
