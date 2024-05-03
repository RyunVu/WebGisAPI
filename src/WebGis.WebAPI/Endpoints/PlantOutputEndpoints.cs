using Carter;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebGis.Core.Collections;
using WebGis.Core.Contracts;
using WebGis.Core.Entities;
using WebGis.Core.Queries;
using WebGis.Services.Extensions;
using WebGis.Services.Gis;
using WebGis.WebAPI.Filters;
using WebGis.WebAPI.Models;

namespace WebGis.WebAPI.Endpoints
{
	public class PlantOutputEndpoints : ICarterModule
	{
		public void AddRoutes(IEndpointRouteBuilder app)
		{
			var routeGroupBuilder = app.MapGroup("/api/plantOutput");

			routeGroupBuilder.MapGet("/", GetPlantOutputs)
				.WithName("GetPlantOutputs")
				.Produces<ApiResponse<PaginationResult<PlantOutputDto>>>();

			routeGroupBuilder.MapGet("/{id:Guid}", GetPlantOutputById)
			   .WithName("GetPlantOutputById")
			   .Produces<ApiResponse<PlantOutputDto>>()
			   .Produces(404);

			routeGroupBuilder.MapGet("/{slug:regex(^[a-z0-9_-]+$)}/PlantOutput", GetPlantOutputBySlug)
				.WithName("GetProductByPlantOutputslug")
				.Produces<ApiResponse<PaginationResult<PlantOutputDto>>>();

			routeGroupBuilder.MapPost("/", AddPlantOutput)
				.WithName("AddNewPlantOutput")
				.AddEndpointFilter<ValidatorFilter<PlantOutputEditModel>>()
				.Produces(201)
				.Produces(400)
				.Produces(409);

			routeGroupBuilder.MapPut("/{id:Guid}", UpdatePlantOutput)
				.WithName("UpdateAPlantOutput")
				.AddEndpointFilter<ValidatorFilter<PlantOutputEditModel>>()
				.Produces(204)
				.Produces(400)
				.Produces(409);

			routeGroupBuilder.MapGet("/commune/{communeId:Guid}", GetPlantOutputsWithCommuneId)
				.WithName("GetPlantOutputsByCommuneId")
				.Produces<ApiResponse<PaginationResult<PlantOutputCommuneItem>>>();


			routeGroupBuilder.MapGet("/plant/{plantId:Guid}/year/{year:int}/month/{month:int}", GetPlantOutsWithPlantIdAndDate)
				.WithName("GetPlantOutputsByPlantIdAndDate")
				.Produces<ApiResponse<PaginationResult<PlantOutputPlantItem>>>();
		}

		#region Get
		private static async Task<IResult> GetPlantOutputs(
			[AsParameters] PlantOutputFilterModel model,
			IPlantOutputRepository plantOutputRepo,
			IMapper mapper)
		{
			var plantOutputQuery = mapper.Map<PlantOutputQuery>(model);
			var PlantOutputs = await plantOutputRepo
				.GetPagedPlantOutputAsync(
					plantOutputQuery, model,
					plantOutput => plantOutput.ProjectToType<PlantOutputDto>());

			var paginationResult = new
				PaginationResult<PlantOutputDto>(PlantOutputs);

			return Results.Ok(ApiResponse.Success(paginationResult));
		}

		private static async Task<IResult> GetPlantOutputById(
				Guid id,
				IPlantOutputRepository plantOutputRepo,
				IMapper mapper)
		{
			var plantOutput = await plantOutputRepo.GetPlantOutputByIdAsync(id, true);

			var plantOutputDetail = mapper.Map<PlantOutputDto>(plantOutput);

			return plantOutputDetail != null
							? Results.Ok(ApiResponse.Success(plantOutputDetail))
							: Results.Ok(ApiResponse.Fail(
									HttpStatusCode.NotFound,
									$"Không tìm thấy phân loại với id: `{id}`"));
		}

		private static async Task<IResult> GetPlantOutputBySlug(
				[FromRoute] string slug,
				IPlantOutputRepository plantOutputRepo,
				IMapper mapper)
		{
			var plantOutput = await plantOutputRepo.GetPlantOutputBySlugAsync(slug);
			var plantOutputDetail = mapper.Map<PlantOutputDto>(plantOutput);
			return plantOutputDetail != null
					? Results.Ok(ApiResponse.Success(plantOutputDetail))
					: Results.Ok(ApiResponse.Fail(
						HttpStatusCode.NotFound, $"Không tìm thấy phân loại với mã định danh: `{slug}`"));
		}

		private static async Task<IResult> GetPlantOutputsWithCommuneId(
			Guid communeId,
			[AsParameters] PagingModel pagingModel,
			IPlantOutputRepository plantOutputRepo,
			ICommuneRepository communeRepo)
		{

			var communeData = await communeRepo.GetCommuneByIdAsync(communeId);

			if (communeData == null)
			{ 
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.NotFound,
					$"Không tìm thấy xã với id tương ứng"));
			}

			var plantOutputs = await plantOutputRepo
				.GetPagedPlantOutputByCommuneIdAsync(
				communeId, pagingModel,
				plantOutput => plantOutput.ProjectToType<PlantOutputDto>());


			var paginationResult = new
				PaginationResult<PlantOutputDto>(plantOutputs);


			return Results.Ok(ApiResponse.Success(paginationResult));
		}

		private static async Task<IResult> GetPlantOutsWithPlantIdAndDate(
			Guid plantId,
			int year,
			int month,
			[AsParameters] PagingModel pagingModel,
			IPlantOutputRepository plantOutputRepo,
			IPlantRepository plantRepo)
		{
			var plantData = await plantRepo.GetPlantByIdAsync(plantId);

			if (plantData == null)
			{
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.NotFound,
					$"Không tìm thấy cây với id tương ứng"));
			}

			var plantOutputs = await plantOutputRepo
				.GetPagedPlantOutputByPlantIdAndDateAsync(
				plantId, year, month, pagingModel,
				plantOutput => plantOutput.ProjectToType<PlantOutputDto>());

			var paginationResult = new
				PaginationResult<PlantOutputDto>(plantOutputs);

			return Results.Ok(ApiResponse.Success(paginationResult));
			
		}

		#endregion

		#region Add

		private static async Task<IResult> AddPlantOutput(
			PlantOutputEditModel model,
			IPlantOutputRepository plantOutputRepo,
			IPlantRepository plantRepo,
			ICommuneRepository communeRepo,
			IMapper mapper)
		{

			var plant = await plantRepo.GetPlantByIdAsync(model.PlantId); 
			var commune = await communeRepo.GetCommuneByIdAsync(model.CommuneId); 

			if (plant == null || commune == null)
			{
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.NotFound,
					$"Không tìm thấy thông tin cây trồng hoặc địa phương tương ứng"));
			}

			var outputName = $"{commune.Name} {plant.Name}";

			var slug = outputName.GenerateSlug();
			
			if (await plantOutputRepo
				.IsPlantOutputSlugExistedAsync(Guid.Empty, slug))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Conflict,
					$"Slug '{model.UrlSlug}' đã được sử dụng"));
			}
			
			var plantOutput = mapper.Map<PlantOutput>(model);
			plantOutput.UrlSlug = slug;
			plantOutput.Time = DateTime.UtcNow;
			var result = await plantOutputRepo.AddOrUpdatePlantOutputAsync(plantOutput);


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

		private static async Task<IResult> UpdatePlantOutput(
			Guid id,
			PlantOutputEditModel model,
			IPlantOutputRepository plantOutputRepo,
			IPlantRepository plantRepo,
			ICommuneRepository communeRepo,
			IMapper mapper)
		{
			var plant = await plantRepo.GetPlantByIdAsync(model.PlantId);
			var commune = await communeRepo.GetCommuneByIdAsync(model.CommuneId);

			if (plant == null || commune == null)
			{
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.NotFound,
					$"Không tìm thấy thông tin cây trồng hoặc địa phương tương ứng"));
			}

			var outputName = $"{commune.Name} {plant.Name}";

			var slug = outputName.GenerateSlug();

			if (await plantOutputRepo.IsPlantOutputSlugExistedAsync(id, model.UrlSlug))
			{
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.Conflict,
					$"Slug {model.UrlSlug} đã được sử dụng"));
			}

			var plantOutput = mapper.Map<PlantOutput>(model);
			plantOutput.Id = id;
			plantOutput.UrlSlug = slug;

			return await plantOutputRepo.AddOrUpdatePlantOutputAsync(plantOutput)
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
