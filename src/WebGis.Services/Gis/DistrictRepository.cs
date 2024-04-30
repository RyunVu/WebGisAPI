using Microsoft.EntityFrameworkCore;
using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;
using WebGis.Data.Contexts;
using WebGis.Services.Extensions;

namespace WebGis.Services.Gis
{
	public class DistrictRepository : IDistrictRepository
	{

		private readonly WebDbContext _dbContext;

        public DistrictRepository(WebDbContext dbContext)
        {
			_dbContext = dbContext;
        }

		private IQueryable<District> FilterDistrict(
			DistrictQuery query)
		{
			return _dbContext.Set<District>()
				.WhereIf(!string.IsNullOrEmpty(query.Keyword),
				a => a.Name.Contains(query.Keyword));
		}

        public async Task<IPagedList<T>> GetPagedDistrictAsync<T>(
			DistrictQuery query, 
			IPagingParams pagingParams, 
			Func<IQueryable<District>, IQueryable<T>> mapper, 
			CancellationToken cancellationToken = default)
		{
			var districts = FilterDistrict(query);
			return await mapper(districts)
				.ToPagedListAsync(pagingParams, cancellationToken);
		}

		public async Task<IList<District>> GetDistrictsAsync(
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<District>()
				.OrderBy(n => n.Name)
				.ToListAsync(cancellationToken);
		}

		public async Task<District> GetDistrictByIdAsync(
			Guid id, 
			bool includeDetail = false, 
			CancellationToken cancellationToken = default)
		{
			if (includeDetail)
			{
				return await _dbContext.Set<District>()
					.Where(d => d.Id.Equals(id))
					.FirstOrDefaultAsync(cancellationToken);
			}

			return await _dbContext.Set<District>()
				.FindAsync(id, cancellationToken);
		}

		public async Task<District> GetDistrictBySlugAsync(
			string slug, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<District>()
						.Where(a => a.UrlSlug.Equals(slug))
						.FirstOrDefaultAsync(cancellationToken);
		}

		public async Task<bool> IsDistrictIdExistedAsync(
			Guid id, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<District>()
				.AnyAsync(x => x.Id.Equals(id), cancellationToken);
		}

		public async Task<bool> IsDistrictSlugExistedAsync(
			Guid id, 
			string slug, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<District>()
				.AnyAsync(a => a.Id != id
					&& a.UrlSlug.Equals(slug), cancellationToken);
		}

		public async Task<bool> ToggleActivedAsync(
			Guid id,
			CancellationToken cancellationToken = default)
		{
			var district = await GetDistrictByIdAsync(id);

			if (district != null)
			{
				district.Actived = !district.Actived;
				await _dbContext.SaveChangesAsync(cancellationToken);
				return true;
			}

			return false;
		}

		public async Task<bool> AddOrUpdateDistrictAsync(
			District district, 
			CancellationToken cancellationToken = default)
		{
			var slug = district.Name.GenerateSlug();
			district.UrlSlug = slug;

			if (district.Id != Guid.Empty)
			{
				_dbContext.Set<District>().Update(district);
			}
			else
			{
				_dbContext.Set<District>().Add(district);
			}

			return await _dbContext
				.SaveChangesAsync(cancellationToken) > 0;
		}

		public async Task<bool> DeleteDistrictByIdAsync(
			Guid id,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<District>()
				.Where(a => a.Id.Equals(id))
				.ExecuteDeleteAsync(cancellationToken) > 0;
		}
	}
}
