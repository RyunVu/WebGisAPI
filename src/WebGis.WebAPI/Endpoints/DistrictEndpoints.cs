using Carter;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebGis.Core.Collections;
using WebGis.Core.Entities;
using WebGis.Core.Queries;
using WebGis.Services.Extensions;
using WebGis.Services.Gis;
using WebGis.WebAPI.Filters;
using WebGis.WebAPI.Models;

namespace WebGis.WebAPI.Endpoints
{
	public class DistrictEndpoints : ICarterModule
	{

		public void AddRoutes(IEndpointRouteBuilder app)
		{
			var routeGroupBuilder = app.MapGroup("/api/district");

			routeGroupBuilder.MapGet("/", GetDistricts)
				.WithName("GetDistricts")
				.Produces<ApiResponse<PaginationResult<DistrictDto>>>();

			routeGroupBuilder.MapGet("/{id:Guid}", GetDistrictById)
			   .WithName("GetDistrictById")
			   .Produces<ApiResponse<DistrictDto>>()
			   .Produces(404);

			routeGroupBuilder.MapGet("/{slug:regex(^[a-z0-9_-]+$)}/district", GetDistrictBySlug)
				.WithName("GetProductByDistrictSlug")
				.Produces<ApiResponse<PaginationResult<DistrictDto>>>();

			routeGroupBuilder.MapPost("/", AddDistrict)
				.WithName("AddNewDistrict")
				.AddEndpointFilter<ValidatorFilter<DistrictEditModel>>()
				.Produces(201)
				.Produces(400)
				.Produces(409);

			routeGroupBuilder.MapPost("/{id:Guid}", ToggleActivedDistrict)
				.WithName("ToggleActivedDistrict")
				.Produces<ApiResponse<string>>();

			routeGroupBuilder.MapPut("/{id:Guid}", UpdateDistrict)
				.WithName("UpdateADistrict")
				.AddEndpointFilter<ValidatorFilter<DistrictEditModel>>()
				.Produces(204)
				.Produces(400)
				.Produces(409);

			routeGroupBuilder.MapDelete("/{id:Guid}", DeleteDistrict)
				.WithName("DeleteADistrict")
				.Produces<ApiResponse<string>>();
		}

		#region Get
		private static async Task<IResult> GetDistricts(
			[AsParameters] DistrictFilterModel model,
			IDistrictRepository districtRepo,
			IMapper mapper)
		{
			var districtQuery = mapper.Map<DistrictQuery>(model);
			var districts = await districtRepo
				.GetPagedDistrictAsync(
					districtQuery, model,
					district => district.ProjectToType<DistrictDto>());

			var paginationResult = new
				PaginationResult<DistrictDto>(districts);

			return Results.Ok(ApiResponse.Success(paginationResult));
		}

		private static async Task<IResult> GetDistrictById(
				Guid id,
				IDistrictRepository districtRepo,
				IMapper mapper)
		{
			var district = await districtRepo.GetDistrictByIdAsync(id, true);

			var DistrictDetail = mapper.Map<DistrictDto>(district);

			return DistrictDetail != null
							? Results.Ok(ApiResponse.Success(DistrictDetail))
							: Results.Ok(ApiResponse.Fail(
									HttpStatusCode.NotFound,
									$"Không tìm thấy huyện với id: `{id}`"));
		}

		private static async Task<IResult> GetDistrictBySlug(
				[FromRoute] string slug,
				IDistrictRepository districtRepo,
				IMapper mapper)
		{
			var district = await districtRepo.GetDistrictBySlugAsync(slug);
			var districtDetail = mapper.Map<DistrictDto>(district);
			return districtDetail != null
					? Results.Ok(ApiResponse.Success(districtDetail))
					: Results.Ok(ApiResponse.Fail(
						HttpStatusCode.NotFound, $"Không tìm thấy huyện với mã định danh: `{slug}`"));
		}

		#endregion

		#region Add

		private static async Task<IResult> AddDistrict(
			DistrictEditModel model,
			IDistrictRepository districtRepo,
			IMapper mapper)
		{
			var slug = model.Name.GenerateSlug();
			if (await districtRepo
				.IsDistrictSlugExistedAsync(Guid.Empty, model.UrlSlug))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Conflict,
					$"Slug '{model.UrlSlug}' đã được sử dụng"));
			}

			var district = mapper.Map<District>(model);
			district.UrlSlug = slug;
			var result = await districtRepo.AddOrUpdateDistrictAsync(district);


			return result
				? Results.Ok(
					ApiResponse.Success(
						"Thêm thành công", HttpStatusCode.Created))
				: Results.Ok(
					ApiResponse.Fail(
						HttpStatusCode.Conflict, $"Đã có lỗi xảy ra"));
		}

		#endregion

		#region Update

		private static async Task<IResult> ToggleActivedDistrict(
			Guid id,
			IDistrictRepository districtRepo)
		{
			return await districtRepo.ToggleActivedAsync(id)
				? Results.Ok(
					ApiResponse.Success(
						"Cập nhập thành công", HttpStatusCode.Created))
				: Results.Ok(
					ApiResponse.Fail(
						HttpStatusCode.Conflict, $"Đã có lỗi xảy ra"));
		}

		private static async Task<IResult> UpdateDistrict(
			Guid id,
			DistrictEditModel model,
			IDistrictRepository districtRepo,
			IMapper mapper)
		{
			if (await districtRepo.IsDistrictSlugExistedAsync(id, model.UrlSlug))
			{
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.Conflict,
					$"Slug {model.UrlSlug} đã được sử dụng"));
			}

			var district = mapper.Map<District>(model);
			district.Id = id;

			return await districtRepo.AddOrUpdateDistrictAsync(district)
				? Results.Ok(
					ApiResponse.Success(
						"Cập nhập thành công", HttpStatusCode.Created))
				: Results.Ok(
					ApiResponse.Fail(
						HttpStatusCode.Conflict, $"Đã có lỗi xảy ra"));

		}

		#endregion

		private static async Task<IResult> DeleteDistrict(Guid id,
		   IDistrictRepository districtRepos)
		{
			return await districtRepos.DeleteDistrictByIdAsync(id)
					? Results.Ok(ApiResponse.Success("Tỉnh đã được xóa", HttpStatusCode.NoContent))
					: Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, $"Không tìm thấy tỉnh với id: `{id}`"));
		}
	}
}
