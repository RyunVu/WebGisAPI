using Microsoft.EntityFrameworkCore;
using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;
using WebGis.Data.Contexts;
using WebGis.Services.Extensions;

namespace WebGis.Services.Gis
{
	public class PlantRepository : IPlantRepository
	{
		private readonly WebDbContext _dbContext;

        public PlantRepository(WebDbContext dbContext)
        {
			_dbContext = dbContext;
        }

		private IQueryable<Plant> FilterPlant(
			PlantQuery query)
		{
			return _dbContext.Set<Plant>()
				.WhereIf(!string.IsNullOrEmpty(query.Keyword),
				a => a.Name.Contains(query.Keyword));
		}

		public async Task<IPagedList<T>> GetPagedPlantAsync<T>(
			PlantQuery query, 
			IPagingParams pagingParams,
			Func<IQueryable<Plant>, IQueryable<T>> mapper,
			CancellationToken cancellationToken = default)
		{
			var plants = FilterPlant(query);
			return await mapper(plants)
				.ToPagedListAsync(pagingParams, cancellationToken);
		}

		public async Task<IList<Plant>> GetPlantsAsync(
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Plant>()
				.OrderBy(n => n.Name)
				.ToListAsync(cancellationToken);
		}

		public async Task<Plant> GetPlantByIdAsync(
			Guid id,
			bool includeDetail = false,
			CancellationToken cancellationToken = default)
		{
			if (includeDetail)
			{
				return await _dbContext.Set<Plant>()
					.Where(d => d.Id.Equals(id))
					.FirstOrDefaultAsync(cancellationToken);
			}

			return await _dbContext.Set<Plant>()
				.FindAsync(id, cancellationToken);
		}

		public async Task<Plant> GetPlantBySlugAsync(
			string slug, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Plant>()
						.Where(a => a.UrlSlug.Equals(slug))
						.FirstOrDefaultAsync(cancellationToken);
		}

		public async Task<bool> IsPlantIdExistedAsync(
			Guid id,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Plant>()
				.AnyAsync(x => x.Id.Equals(id), cancellationToken);
		}

		public async Task<bool> IsPlantSlugExistedAsync(
			Guid id, 
			string slug, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Plant>()
				.AnyAsync(a => a.Id != id
					&& a.UrlSlug.Equals(slug), cancellationToken);
		}

		public async Task<bool> ToggleActivedAsync(
			Guid id,
			CancellationToken cancellationToken = default)
		{
			var plant = await GetPlantByIdAsync(id);

			if (plant != null)
			{
				plant.Actived = !plant.Actived;
				await _dbContext.SaveChangesAsync(cancellationToken);
				return true;
			}

			return false;
		}

		public async Task<bool> AddOrUpdatePlantAsync(
			Plant plant, 
			CancellationToken cancellationToken = default)
		{
			var slug = plant.Name.GenerateSlug();
			plant.UrlSlug = slug;

			if (plant.Id != Guid.Empty)
			{
				_dbContext.Set<Plant>().Update(plant);
			}
			else
			{
				_dbContext.Set<Plant>().Add(plant);
			}

			return await _dbContext
				.SaveChangesAsync(cancellationToken) > 0;
		}

		public async Task<bool> DeletePlantByIdAsync(
			Guid id, 
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Plant>()
				.Where(c => c.Id.Equals(id))
				.ExecuteDeleteAsync(cancellationToken) > 0;
		}
	}
}
