using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;

namespace WebGis.Services.Gis
{
	public interface IPlantRepository
	{
		Task<IPagedList<T>> GetPagedPlantAsync<T>(
		PlantQuery query,
		IPagingParams pagingParams,
		Func<IQueryable<Plant>, IQueryable<T>> mapper,
		CancellationToken cancellationToken = default);

		Task<IList<Plant>> GetPlantsAsync(
			CancellationToken cancellationToken = default);
		Task<Plant> GetPlantByIdAsync(
			Guid id,
			bool includeDetail = false,
			CancellationToken cancellationToken = default);

		Task<Plant> GetPlantBySlugAsync(
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> IsPlantIdExistedAsync(
			Guid id,
			CancellationToken cancellationToken = default);

		Task<bool> IsPlantSlugExistedAsync(
			Guid id,
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> ToggleActivedAsync(
			Guid id,
			CancellationToken cancellationToken = default);

		Task<bool> AddOrUpdatePlantAsync(
			Plant plant,
			CancellationToken cancellationToken = default);

		Task<bool> DeletePlantByIdAsync(
			Guid id,
			CancellationToken cancellationToken = default);
	}
}
