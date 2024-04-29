using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;

namespace WebGis.Services.Gis
{
	public interface ICategoryRepository
	{
		Task<IPagedList<T>> GetPagedCategoryAsync<T>(
		CategoryQuery query,
		IPagingParams pagingParams,
		Func<IQueryable<Category>, IQueryable<T>> mapper,
		CancellationToken cancellationToken = default);

		Task<IList<Category>> GetCategorysAsync(
			CancellationToken cancellationToken = default);
		Task<Category> GetCategoryByIdAsync(
			Guid id,
			bool includeDetail = false,
			CancellationToken cancellationToken = default);

		Task<Category> GetCategoryBySlugAsync(
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> IsCategoryIdExistedAsync(
			Guid id,
			CancellationToken cancellationToken = default);

		Task<bool> IsCategorySlugExistedAsync(
			Guid id,
			string slug,
			CancellationToken cancellationToken = default);

		Task<bool> ToggleActivedAsync(
			Guid id,
			CancellationToken cancellationToken = default);

		Task<bool> AddOrUpdateCategoryAsync(
			Category category,
			CancellationToken cancellationToken = default);

		Task<bool> DeleteCategoryByIdAsync(
			Guid id,
			CancellationToken cancellationToken = default);
	}
}
