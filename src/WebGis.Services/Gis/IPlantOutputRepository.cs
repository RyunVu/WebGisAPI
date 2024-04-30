using NetTopologySuite.Mathematics;
using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;
using WebGis.Services.Extensions;

namespace WebGis.Services.Gis
{
	public interface IPlantOutputRepository
	{
		Task<IPagedList<T>> GetPagedPlantOutputAsync<T>(
			PlantOutputQuery query,
			IPagingParams pagingParams,
			Func<IQueryable<PlantOutput>, IQueryable<T>> mapper,
			CancellationToken cancellationToken = default);

		Task<IPagedList<T>> GetPagedPlantOutputByCommuneIdAsync<T>(
			Guid communeId,
			IPagingParams pagingParams,
			Func<IQueryable<PlantOutput>, IQueryable<T>> mapper,
			CancellationToken cancellationToken = default);

		Task<IPagedList<T>> GetPagedPlantOutputByPlantIdAndDateAsync<T>(
			Guid plantId, int year, int month,
			IPagingParams pagingParams,
			Func<IQueryable<PlantOutput>, IQueryable<T>> mapper,
			CancellationToken cancellationToken = default);

		Task<IList<PlantOutput>> GetPlantOutputsAsync(
			CancellationToken cancellationToken = default);
		Task<PlantOutput> GetPlantOutputByIdAsync(
			Guid id,
			bool includeDetail = false,
			CancellationToken cancellationToken = default);

		Task<PlantOutput> GetPlantOutputBySlugAsync(
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> IsPlantOutputIdExistedAsync(
			Guid id,
			CancellationToken cancellationToken = default);

		Task<bool> IsPlantOutputSlugExistedAsync(
			Guid id,
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> ToggleActivedAsync(
			Guid id,
			CancellationToken cancellationToken = default);

		Task<bool> AddOrUpdatePlantOutputAsync(
			PlantOutput PlantOutput,
			CancellationToken cancellationToken = default);

		Task<bool> DeletePlantOutputByIdAsync(
			Guid id,
			CancellationToken cancellationToken = default);

		Task<IList<PlantOutput>> GetPlantOutputByCommuneId(
			Guid communeId,
			CancellationToken cancellationToken = default);
	}
}
