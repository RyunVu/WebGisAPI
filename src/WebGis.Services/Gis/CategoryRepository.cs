using Microsoft.EntityFrameworkCore;
using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;
using WebGis.Data.Contexts;
using WebGis.Services.Extensions;

namespace WebGis.Services.Gis
{
	public class CategoryRepository : ICategoryRepository
	{

		private readonly WebDbContext _dbContext;

		public CategoryRepository(WebDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		private IQueryable<Category> FilterCategory(
			CategoryQuery query)
		{
			return _dbContext.Set<Category>()
				.WhereIf(!string.IsNullOrEmpty(query.Keyword), a =>
				a.Name.Contains(query.Keyword) ||
				a.Description.Contains(query.Keyword) ||
				a.UrlSlug.Contains(query.Keyword))
				.WhereIf(query.Actived.HasValue, a =>
				a.Actived == query.Actived);

		}


		public async Task<IPagedList<T>> GetPagedCategoryAsync<T>(
			CategoryQuery query, 
			IPagingParams pagingParams, 
			Func<IQueryable<Category>, IQueryable<T>> mapper,
			CancellationToken cancellationToken = default)
		{
			var categories = FilterCategory(query);
			return await mapper(categories)
				.ToPagedListAsync(pagingParams, cancellationToken);
		}

		public async Task<IList<Category>> GetCategorysAsync(
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Category>()
				.OrderBy(n => n.Name)
				.ToListAsync(cancellationToken);
		}

		public async Task<Category> GetCategoryByIdAsync(
			Guid id, 
			bool includeDetail = false, 
			CancellationToken cancellationToken = default)
		{
			if (includeDetail)
			{
				return await _dbContext.Set<Category>()
					.Where(d => d.Id.Equals(id))
					.FirstOrDefaultAsync(cancellationToken);
			}

			return await _dbContext.Set<Category>()
				.FindAsync(id, cancellationToken);
		}

		public async Task<Category> GetCategoryBySlugAsync(
			string slug, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Category>()
						.Where(a => a.UrlSlug.Equals(slug))
						.FirstOrDefaultAsync(cancellationToken);
		}

		public async Task<bool> IsCategoryIdExistedAsync(
			Guid id, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Category>()
				.AnyAsync(x => x.Id.Equals(id), cancellationToken);
		}

		public async Task<bool> IsCategorySlugExistedAsync(
			Guid id, 
			string slug, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Category>()
				.AnyAsync(a => a.Id != id
					&& a.UrlSlug.Equals(slug), cancellationToken);
		}

		public async Task<bool> ToggleActivedAsync(
			Guid id, 
			CancellationToken cancellationToken = default)
		{
			var category = await GetCategoryByIdAsync(id);

			if (category != null)
			{
				category.Actived = !category.Actived;
				await _dbContext.SaveChangesAsync(cancellationToken);
				return true;
			}

			return false;
		}

		public async Task<bool> AddOrUpdateCategoryAsync(
			Category category, 
			CancellationToken cancellationToken = default)
		{
			if (category.Id != Guid.Empty)
			{
				var slug = category.Name.GenerateSlug();
				category.UrlSlug = slug;
				_dbContext.Set<Category>().Update(category);
			}
			else
			{
				_dbContext.Set<Category>().Add(category);
			}

			return await _dbContext
				.SaveChangesAsync(cancellationToken) > 0;
		}

		public async Task<bool> DeleteCategoryByIdAsync(
			Guid id, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Category>()
				.Where(c => c.Id.Equals(id))
				.ExecuteDeleteAsync(cancellationToken) > 0;
		}

	}
}
