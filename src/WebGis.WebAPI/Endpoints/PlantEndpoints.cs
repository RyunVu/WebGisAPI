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
	public class PlantEndpoints : ICarterModule
	{
		public void AddRoutes(IEndpointRouteBuilder app)
		{
			var routeGroupBuilder = app.MapGroup("/api/plant");

			routeGroupBuilder.MapGet("/", GetPlants)
				.WithName("GetPlants")
				.Produces<ApiResponse<PaginationResult<PlantDto>>>();

			routeGroupBuilder.MapGet("/{id:Guid}", GetPlantById)
			   .WithName("GetPlantById")
			   .Produces<ApiResponse<PlantDto>>()
			   .Produces(404);

			routeGroupBuilder.MapGet("/{slug:regex(^[a-z0-9_-]+$)}/Plant", GetPlantBySlug)
				.WithName("GetProductByPlantslug")
				.Produces<ApiResponse<PaginationResult<PlantDto>>>();

			routeGroupBuilder.MapPost("/", AddPlant)
				.WithName("AddNewPlant")
				.AddEndpointFilter<ValidatorFilter<PlantEditModel>>()
				.Produces(201)
				.Produces(400)
				.Produces(409);

			routeGroupBuilder.MapPost("/{id:Guid}", ToggleActivedPlant)
				.WithName("ToggleActivedPlant")
				.Produces<ApiResponse<string>>();

			routeGroupBuilder.MapPut("/{id:int}", UpdatePlant)
				.WithName("UpdateAPlant")
				.AddEndpointFilter<ValidatorFilter<PlantEditModel>>()
				.Produces(204)
				.Produces(400)
				.Produces(409);

			routeGroupBuilder.MapDelete("/{id:Guid}", DeletePlant)
				.WithName("DeleteAPlant")
				.Produces<ApiResponse<string>>();
		}

		#region Get
		private static async Task<IResult> GetPlants(
			[AsParameters] PlantFilterModel model,
			IPlantRepository PlantRepo,
			IMapper mapper)
		{
			var plantQuery = mapper.Map<PlantQuery>(model);
			var plants = await PlantRepo
				.GetPagedPlantAsync(
					plantQuery, model,
					Plant => Plant.ProjectToType<PlantDto>());

			var paginationResult = new
				PaginationResult<PlantDto>(plants);

			return Results.Ok(ApiResponse.Success(paginationResult));
		}

		private static async Task<IResult> GetPlantById(
				Guid id,
				IPlantRepository plantRepo,
				IMapper mapper)
		{
			var plant = await plantRepo.GetPlantByIdAsync(id, true);

			var plantDetail = mapper.Map<PlantDto>(plant);

			return plantDetail != null
							? Results.Ok(ApiResponse.Success(plantDetail))
							: Results.Ok(ApiResponse.Fail(
									HttpStatusCode.NotFound,
									$"Không tìm thấy phân loại với id: `{id}`"));
		}

		private static async Task<IResult> GetPlantBySlug(
				[FromRoute] string slug,
				IPlantRepository plantRepo,
				IMapper mapper)
		{
			var plant = await plantRepo.GetPlantBySlugAsync(slug);
			var plantDetail = mapper.Map<PlantDto>(plant);
			return plantDetail != null
					? Results.Ok(ApiResponse.Success(plantDetail))
					: Results.Ok(ApiResponse.Fail(
						HttpStatusCode.NotFound, $"Không tìm thấy phân loại với mã định danh: `{slug}`"));
		}

		#endregion

		#region Add

		private static async Task<IResult> AddPlant(
			PlantEditModel model,
			IPlantRepository plantRepo,
			IMapper mapper)
		{
			var slug = model.Name.GenerateSlug();
			if (await plantRepo
				.IsPlantSlugExistedAsync(Guid.Empty, model.UrlSlug))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Conflict,
					$"Slug '{model.UrlSlug}' đã được sử dụng"));
			}

			var plant = mapper.Map<Plant>(model);
			plant.UrlSlug = slug;
			var result = await plantRepo.AddOrUpdatePlantAsync(plant);


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

		private static async Task<IResult> ToggleActivedPlant(
			Guid id,
			IPlantRepository plantRepo)
		{
			return await plantRepo.ToggleActivedAsync(id)
				? Results.Ok(
					ApiResponse.Success(
						"Cập nhập thành công", HttpStatusCode.Created))
				: Results.Ok(
					ApiResponse.Fail(
						HttpStatusCode.Conflict, $"Đã có lỗi xảy ra"));
		}

		private static async Task<IResult> UpdatePlant(
			Guid id,
			PlantEditModel model,
			IPlantRepository plantRepo,
			IMapper mapper)
		{
			if (await plantRepo.IsPlantSlugExistedAsync(id, model.UrlSlug))
			{
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.Conflict,
					$"Slug {model.UrlSlug} đã được sử dụng"));
			}

			var plant = mapper.Map<Plant>(model);
			plant.Id = id;

			return await plantRepo.AddOrUpdatePlantAsync(plant)
				? Results.Ok(
					ApiResponse.Success(
						"Cập nhập thành công", HttpStatusCode.Created))
				: Results.Ok(
					ApiResponse.Fail(
						HttpStatusCode.Conflict, $"Đã có lỗi xảy ra"));

		}

		#endregion

		private static async Task<IResult> DeletePlant(
			Guid id,
			IPlantRepository plantRepo)
		{
			return await plantRepo.DeletePlantByIdAsync(id)
					? Results.Ok(ApiResponse.Success("Cây đã được xóa", HttpStatusCode.NoContent))
					: Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, $"Không tìm thấy cây với id: `{id}`"));
		}
	}
}
