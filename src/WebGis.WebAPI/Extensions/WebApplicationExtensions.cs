using Carter;
using Microsoft.EntityFrameworkCore;
using NLog.Web;
using Npgsql;
using WebGis.Data.Contexts;
using WebGis.Data.Seeders;
using WebGis.Services.Gis;

namespace WebGis.WebAPI.Extensions
{
	public static class WebApplicationExtensions
	{
		public static WebApplicationBuilder ConfigureServices(
			this WebApplicationBuilder builder)
		{

			builder.Services.AddMemoryCache();

			var connectionString = builder.Configuration.GetConnectionString("LacDuongDb");
			var dataSource = new NpgsqlConnectionStringBuilder(connectionString)
			{
				ApplicationName = builder.Environment.ApplicationName,
				Pooling = true,
				TrustServerCertificate = true
			}.ConnectionString;


			builder.Services.AddCarter();
			builder.Services.AddMemoryCache();

			// Register the DbContext
			builder.Services.AddDbContext<WebDbContext>(options =>
				options.UseNpgsql(dataSource, o => o.UseNetTopologySuite()));


			builder.Services.AddScoped<IDataSeeder, DataSeeder>();
			builder.Services.AddScoped<IDistrictRepository, DistrictRepository>();
			builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
			builder.Services.AddScoped<ICommuneRepository, CommuneRepository>();
			builder.Services.AddScoped<IPlantRepository, PlantRepository>();



			return builder;
		}

		public static WebApplicationBuilder ConfigureCors(
			this WebApplicationBuilder builder)
		{
			builder.Services.AddCors(options => {
				options.AddPolicy("WebGisApp", policyBuilder =>
					policyBuilder
						.AllowAnyOrigin()
						.AllowAnyHeader()
						.AllowAnyMethod());
			});

			return builder;
		}

		public static WebApplicationBuilder ConfigureNLog(
			this WebApplicationBuilder builder)
		{

			builder.Logging.ClearProviders();
			builder.Host.UseNLog();

			return builder;
		}

		public static IApplicationBuilder UseDataSeeder(
			this IApplicationBuilder app)
		{
			using var scope = app.ApplicationServices.CreateScope();
			try
			{
				scope.ServiceProvider
					.GetRequiredService<IDataSeeder>()
					.Initialize();
			}
			catch (Exception ex)
			{
				scope.ServiceProvider
								.GetRequiredService<ILogger<Program>>()
								.LogError(ex, "Could not insert data into database");
			}

			return app;
		}

		public static WebApplicationBuilder ConfigureSwaggerOpenApi(
			this WebApplicationBuilder builder)
		{

			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			return builder;
		}


		public static WebApplication SetupRequestPipeline(
			this WebApplication app)
		{

			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseStaticFiles();
			app.UseHttpsRedirection();

			app.UseCors("WebGisApp");

			return app;
		}

	}
}
