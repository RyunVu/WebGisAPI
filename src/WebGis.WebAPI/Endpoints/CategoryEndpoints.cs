using Carter;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations;
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
	public class CategoryEndpoints : ICarterModule
	{
		public void AddRoutes(IEndpointRouteBuilder app)
		{
			var routeGroupBuilder = app.MapGroup("/api/category");

			routeGroupBuilder.MapGet("/", GetCategories)
				.WithName("GetCategories")
				.Produces<ApiResponse<PaginationResult<CategoryDto>>>();

			routeGroupBuilder.MapGet("/{id:Guid}", GetCategoryById)
			   .WithName("GetCategoryById")
			   .Produces<ApiResponse<CategoryDto>>()
			   .Produces(404);

			routeGroupBuilder.MapGet("/{slug:regex(^[a-z0-9_-]+$)}/category", GetCategoryBySlug)
				.WithName("GetProductByCategorieslug")
				.Produces<ApiResponse<PaginationResult<CategoryDto>>>();

			routeGroupBuilder.MapPost("/", AddCategory)
				.WithName("AddNewCategory")
				.AddEndpointFilter<ValidatorFilter<CategoryEditModel>>()
				.Produces<ApiResponse<CategoryDto>>();

			routeGroupBuilder.MapPost("/{id:Guid}", ToggleActivedCategory)
				.WithName("ToggleActivedCategory")
				.Produces<ApiResponse<string>>();

			routeGroupBuilder.MapPut("/{id:Guid}", UpdateCategory)
				.WithName("UpdateACategory")
				.AddEndpointFilter<ValidatorFilter<CategoryEditModel>>()
				.Produces<ApiResponse<string>>();


			routeGroupBuilder.MapDelete("/{id:Guid}", DeleteCategory)
				.WithName("DeleteACategory")
				.Produces<ApiResponse<string>>();


		}

		#region Get
		private static async Task<IResult> GetCategories(
			[AsParameters] CategoryFilterModel model,
			ICategoryRepository CategoryRepo,
			IMapper mapper)
		{
			var categoryQuery = mapper.Map<CategoryQuery>(model);
			var categories = await CategoryRepo
				.GetPagedCategoryAsync(
					categoryQuery, model,
					category => category.ProjectToType<CategoryDto>());

			var paginationResult = new
				PaginationResult<CategoryDto>(categories);

			return Results.Ok(ApiResponse.Success(paginationResult));
		}

		private static async Task<IResult> GetCategoryById(
				Guid id,
				ICategoryRepository CategoryRepo,
				IMapper mapper)
		{
			var category = await CategoryRepo.GetCategoryByIdAsync(id, true);

			var categoryDetail = mapper.Map<CategoryDto>(category);

			return categoryDetail != null
							? Results.Ok(ApiResponse.Success(categoryDetail))
							: Results.Ok(ApiResponse.Fail(
									HttpStatusCode.NotFound,
									$"Không tìm thấy phân loại với id: `{id}`"));
		}

		private static async Task<IResult> GetCategoryBySlug(
				[FromRoute] string slug,
				ICategoryRepository CategoryRepo,
				IMapper mapper)
		{
			var Category = await CategoryRepo.GetCategoryBySlugAsync(slug);
			var CategoryDetail = mapper.Map<CategoryDto>(Category);
			return CategoryDetail != null
					? Results.Ok(ApiResponse.Success(CategoryDetail))
					: Results.Ok(ApiResponse.Fail(
						HttpStatusCode.NotFound, $"Không tìm thấy phân loại với mã định danh: `{slug}`"));
		}

		#endregion

		#region Add

		private static async Task<IResult> AddCategory(
			CategoryEditModel model,
			ICategoryRepository CategoryRepo,
			IMapper mapper)
		{
			var slug = model.Name.GenerateSlug();
			if (await CategoryRepo
				.IsCategorySlugExistedAsync(Guid.Empty, model.UrlSlug))
			{
				return Results.Ok(ApiResponse.Fail(HttpStatusCode.Conflict,
					$"Slug '{model.UrlSlug}' đã được sử dụng"));
			}

			var Category = mapper.Map<Category>(model);
			Category.UrlSlug = slug;
			var result = await CategoryRepo.AddOrUpdateCategoryAsync(Category);


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

		private static async Task<IResult> ToggleActivedCategory(
			Guid id,
			ICategoryRepository categoryRepo)
		{
			return await categoryRepo.ToggleActivedAsync(id)
				? Results.Ok(
					ApiResponse.Success(
						"Cập nhập thành công", HttpStatusCode.Created))
				: Results.Ok(
					ApiResponse.Fail(
						HttpStatusCode.Conflict, $"Đã có lỗi xảy ra"));
		}

		private static async Task<IResult> UpdateCategory(
			Guid id,
			CategoryEditModel model,
			ICategoryRepository categoryRepo,
			IMapper mapper)
		{
			if (await categoryRepo.IsCategorySlugExistedAsync(id, model.UrlSlug))
			{
				return Results.Ok(ApiResponse.Fail(
					HttpStatusCode.Conflict,
					$"Slug {model.UrlSlug} đã được sử dụng"));
			}

			var Category = mapper.Map<Category>(model);
			Category.Id = id;

			return await categoryRepo.AddOrUpdateCategoryAsync(Category)
				? Results.Ok(
					ApiResponse.Success(
						"Cập nhập thành công", HttpStatusCode.Created))
				: Results.Ok(
					ApiResponse.Fail(
						HttpStatusCode.Conflict, $"Đã có lỗi xảy ra"));

		}

		#endregion

		private static async Task<IResult> DeleteCategory(Guid id,
		   ICategoryRepository categoryRepo)
		{
			return await categoryRepo.DeleteCategoryByIdAsync(id)
					? Results.Ok(ApiResponse.Success("Chủ đề đã được xóa", HttpStatusCode.NoContent))
					: Results.Ok(ApiResponse.Fail(HttpStatusCode.NotFound, $"Không tìm thấy chủ đề với id: `{id}`"));
		}


	}
}
