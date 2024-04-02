using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;

namespace WebGis.Services.Gis
{
	public interface ICommuneRepository
	{
		Task<IPagedList<T>> GetPagedCommuneAsync<T>(
		CommuneQuery query,
		IPagingParams pagingParams,
		Func<IQueryable<Commune>, IQueryable<T>> mapper,
		CancellationToken cancellationToken = default);

		Task<IList<Commune>> GetCommunesAsync(
			CancellationToken cancellationToken = default);
		Task<Commune> GetCommuneByIdAsync(
			Guid id,
			bool includeDetail = false,
			CancellationToken cancellationToken = default);

		Task<Commune> GetCommuneBySlugAsync(
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> IsCommuneIdExistedAsync(
			Guid id,
			CancellationToken cancellationToken = default);

		Task<bool> IsCommuneSlugExistedAsync(
			Guid id,
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> AddOrUpdateCommuneAsync(
			Commune commune,
			CancellationToken cancellationToken = default);

		Task<bool> DeleteCommuneByIdAsync(
			Guid id,
			CancellationToken cancellationToken = default);
	}
}
