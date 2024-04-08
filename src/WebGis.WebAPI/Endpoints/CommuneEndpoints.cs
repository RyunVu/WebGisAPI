using Carter;
using FluentValidation;
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
	public class CommuneEndpoints : ICarterModule
	{
		public void AddRoutes(IEndpointRouteBuilder app)
		{
			var routeGroupBuilder = app.MapGroup("/api/commune");

			routeGroupBuilder.MapGet("/", GetCommunes)
				.WithName("GetCommunes")
				.Produces<ApiResponse<PaginationResult<CommuneDto>>>();

			routeGroupBuilder.MapGet("/{id:Guid}", GetCommuneById)
			   .WithName("GetCommuneById")
			   .Produces<ApiResponse<CommuneDto>>()
			   .Produces(404);

			routeGroupBuilder.MapGet("/{slug:regex(^[a-z0-9_-]+$)}/Commune", GetCommuneBySlug)
				.WithName("GetProductByCommuneslug")
				.Produces<ApiResponse<PaginationResult<CommuneDto>>>();

			routeGroupBuilder.MapPost("/", AddCommune)
				.WithName("AddNewCommune")
				.AddEndpointFilter<ValidatorFilter<CommuneEditModel>>()
				.Produces(201)
				.Produces(400)
				.Produces(409);

			routeGroupBuilder.MapPut("/{id:Guid}", UpdateCommune)
				.WithName("UpdateACommune")
				.AddEndpointFilter<ValidatorFilter<CommuneEditModel>>()
				.Produces(204)
				.Produces(400)
				.Produces(409);
		}

		#region Get
		private static async Task<IResult> GetCommunes(
			[AsParameters] CommuneFilterModel model,
			ICommuneRepository communeRepo,
			IMapper mapper)
		{
			var communeQuery = mapper.Map<CommuneQuery>(model);
			var communes = await communeRepo
				.GetPagedCommuneAsync(
					communeQuery, model,
					Commune => Commune.ProjectToType<CommuneDto>());

			var paginationResult = new
				PaginationResult<CommuneDto>(communes);

			return Results.Ok(ApiResponse.Success(paginationResult));
		}

		private static async Task<IResult> GetCommuneById(
				Guid id,
				ICommuneRepository communeRepo,
				IMapper mapper)
		{
			var commune = await communeRepo.GetCommuneByIdAsync(id, true);

			var communeDetail = mapper.Map<CommuneDto>(commune);

			return communeDetail != null
							? Results.Ok(ApiResponse.Success(communeDetail))
							: Results.Ok(ApiResponse.Fail(
									HttpStatusCode.NotFound,
									$"Không tìm thấy phân loại với id: `{id}`"));
		}

		private static async Task<IResult> GetCommuneBySlug(
				[FromRoute] string slug,
				ICommuneRepository communeRepo,
				IMapper mapper)
		{
			var commune = await communeRepo.GetCommuneBySlugAsync(slug);
			var communeDetail = mapper.Map<CommuneDto>(commune);
			return communeDetail != null
					? Results.Ok(ApiResponse.Success(communeDetail))
					: Results.Ok(ApiResponse.Fail(
						HttpStatusCode.NotFound, $"Không tìm thấy phân loại với mã định danh: `{slug}`"));
		}

		#endregion

		#region Add

		private static async Task<IResult> AddCommune(
			CommuneEditModel model,
			ICommuneRepository communeRepo,
			IMapper mapper)
		{
			var slug = model.Name.GenerateSlug();
			if (await communeRepo
				.IsCommuneSlugExistedAsync(Guid.Empty, model.UrlSlug))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Conflict,
					$"Slug '{model.UrlSlug}' đã được sử dụng"));
			}

			var commune = mapper.Map<Commune>(model);
			commune.UrlSlug = slug;	
			var result = await communeRepo.AddOrUpdateCommuneAsync(commune);


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

		private static async Task<IResult> UpdateCommune(
			Guid id,
			CommuneEditModel model,
			ICommuneRepository communeRepo,
			IMapper mapper)
		{
			if (await communeRepo.IsCommuneSlugExistedAsync(id, model.UrlSlug))
			{
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.Conflict,
					$"Slug {model.UrlSlug} đã được sử dụng"));
			}

			var commune = mapper.Map<Commune>(model);
			commune.Id = id;

			return await communeRepo.AddOrUpdateCommuneAsync(commune)
				? Results.Ok(
					ApiResponse.Success(
						"Cập nhập thành công", HttpStatusCode.Created))
				: Results.Ok(
					ApiResponse.Fail(
						HttpStatusCode.Conflict, $"Đã có lỗi xảy ra"));

		}

		#endregion
	}
}
