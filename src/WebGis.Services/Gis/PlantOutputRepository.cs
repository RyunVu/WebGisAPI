using Microsoft.EntityFrameworkCore;
using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;
using WebGis.Data.Contexts;
using WebGis.Services.Extensions;

namespace WebGis.Services.Gis
{
	public class PlantOutputRepository : IPlantOutputRepository
	{
		private readonly WebDbContext _dbContext;

		public PlantOutputRepository(WebDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		private IQueryable<PlantOutput> FilterPlantOutput(
			PlantOutputQuery query)
		{
			return _dbContext.Set<PlantOutput>()
				.WhereIf(!string.IsNullOrEmpty(query.Keyword),
				a => a.Plant.Name.Contains(query.Keyword) &&
				a.Commune.Name.Contains(query.Keyword));
		}


		public async Task<IPagedList<T>> GetPagedPlantOutputAsync<T>(
			PlantOutputQuery query,
			IPagingParams pagingParams,
			Func<IQueryable<PlantOutput>, IQueryable<T>> mapper,
			CancellationToken cancellationToken = default)
		{
			var PlantOutputs = FilterPlantOutput(query);
			return await mapper(PlantOutputs)
				.ToPagedListAsync(pagingParams, cancellationToken);
		}

		public async Task<IList<PlantOutput>> GetPlantOutputsAsync(
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<PlantOutput>()
				.OrderBy(n => n.Quantity)
				.ToListAsync(cancellationToken);
		}

		public async Task<PlantOutput> GetPlantOutputByIdAsync(
			Guid id,
			bool includeDetail = false,
			CancellationToken cancellationToken = default)
		{
			if (includeDetail)
			{
				return await _dbContext.Set<PlantOutput>()
					.Where(d => d.Id.Equals(id))
					.FirstOrDefaultAsync(cancellationToken);
			}

			return await _dbContext.Set<PlantOutput>()
				.FindAsync(id, cancellationToken);
		}

		public async Task<PlantOutput> GetPlantOutputBySlugAsync(
			string slug,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<PlantOutput>()
						.Where(a => a.UrlSlug.Equals(slug))
						.FirstOrDefaultAsync(cancellationToken);
		}

		public async Task<bool> IsPlantOutputIdExistedAsync(
			Guid id,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<PlantOutput>()
				.AnyAsync(x => x.Id.Equals(id), cancellationToken);
		}

		public async Task<bool> IsPlantOutputSlugExistedAsync(
			Guid id,
			string slug,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<PlantOutput>()
				.AnyAsync(a => a.Id != id
					&& a.UrlSlug.Equals(slug), cancellationToken);
		}

		public async Task<bool> AddOrUpdatePlantOutputAsync(
			PlantOutput plantOutput,
			CancellationToken cancellationToken = default)
		{
			if (plantOutput.Id != Guid.Empty)
			{
				_dbContext.Set<PlantOutput>().Update(plantOutput);
			}
			else
			{
				_dbContext.Set<PlantOutput>().Add(plantOutput);
			}

			return await _dbContext
				.SaveChangesAsync(cancellationToken) > 0;
		}

		public async Task<bool> DeletePlantOutputByIdAsync(
			Guid id,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<PlantOutput>()
				.Where(c => c.Id.Equals(id))
				.ExecuteDeleteAsync(cancellationToken) > 0;
		}
	}
}
