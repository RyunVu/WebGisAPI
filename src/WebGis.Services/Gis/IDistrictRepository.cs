using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;

namespace WebGis.Services.Gis
{
	public interface IDistrictRepository
	{
		Task<IPagedList<T>> GetPagedDistrictAsync<T>(
		DistrictQuery query,
		IPagingParams pagingParams,
		Func<IQueryable<District>, IQueryable<T>> mapper,
		CancellationToken cancellationToken = default);

		Task<IList<District>> GetDistrictsAsync(
			CancellationToken cancellationToken = default);
		Task<District> GetDistrictByIdAsync(
			Guid id,
			bool includeDetail = false,
			CancellationToken cancellationToken = default);

		Task<District> GetDistrictBySlugAsync(
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> IsDistrictIdExistedAsync(
			Guid id,
			CancellationToken cancellationToken = default);

		Task<bool> IsDistrictSlugExistedAsync(
			Guid id,
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> AddOrUpdateDistrictAsync(
			District district,
			CancellationToken cancellationToken = default);

		//Task<bool> DeleteDistrictByIdAsync(
		//	Guid id,
		//	CancellationToken cancellationToken = default);
	}
}
