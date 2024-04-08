using Microsoft.EntityFrameworkCore;
using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;
using WebGis.Data.Contexts;
using WebGis.Services.Extensions;

namespace WebGis.Services.Gis
{
	public class CommuneRepository : ICommuneRepository
	{

		private readonly WebDbContext _dbContext;

		public CommuneRepository(WebDbContext dbContext)
		{
			_dbContext = dbContext;
		}

		private IQueryable<Commune> FilterCommune(
			CommuneQuery query)
		{
			return _dbContext.Set<Commune>()
				.WhereIf(!string.IsNullOrEmpty(query.Keyword),
				a => a.Name.Contains(query.Keyword));
		}


		public async Task<IPagedList<T>> GetPagedCommuneAsync<T>(
			CommuneQuery query,
			IPagingParams pagingParams,
			Func<IQueryable<Commune>, IQueryable<T>> mapper,
			CancellationToken cancellationToken = default)
		{
			var communes = FilterCommune(query);
			return await mapper(communes)
				.ToPagedListAsync(pagingParams, cancellationToken);
		}

		public async Task<IList<Commune>> GetCommunesAsync(
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Commune>()
				.OrderBy(n => n.Name)
				.ToListAsync(cancellationToken);
		}

		public async Task<Commune> GetCommuneByIdAsync(
			Guid id,
			bool includeDetail = false,
			CancellationToken cancellationToken = default)
		{
			if (includeDetail)
			{
				return await _dbContext.Set<Commune>()
					.Where(d => d.Id.Equals(id))
					.FirstOrDefaultAsync(cancellationToken);
			}

			return await _dbContext.Set<Commune>()
				.FindAsync(id, cancellationToken);
		}

		public async Task<Commune> GetCommuneBySlugAsync(
			string slug,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Commune>()
						.Where(a => a.UrlSlug.Equals(slug))
						.FirstOrDefaultAsync(cancellationToken);
		}

		public async Task<bool> IsCommuneIdExistedAsync(
			Guid id,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Commune>()
				.AnyAsync(x => x.Id.Equals(id), cancellationToken);
		}

		public async Task<bool> IsCommuneSlugExistedAsync(
			Guid id,
			string slug,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Commune>()
				.AnyAsync(a => a.Id != id
					&& a.UrlSlug.Equals(slug), cancellationToken);
		}

		public async Task<bool> AddOrUpdateCommuneAsync(
			Commune commune,
			CancellationToken cancellationToken = default)
		{
			if (commune.Id != Guid.Empty)
			{
				_dbContext.Set<Commune>().Update(commune);
			}
			else
			{
				_dbContext.Set<Commune>().Add(commune);
			}

			return await _dbContext
				.SaveChangesAsync(cancellationToken) > 0;
		}

		public async Task<bool> DeleteCommuneByIdAsync(
			Guid id,
			CancellationToken cancellationToken = default)
		{
			return await _dbContext.Set<Commune>()
				.Where(c => c.Id.Equals(id))
				.ExecuteDeleteAsync(cancellationToken) > 0;
		}
	}
}
