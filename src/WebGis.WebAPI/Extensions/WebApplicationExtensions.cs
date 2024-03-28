using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using NLog.Web;
using System.Data;
using System.Security.Claims;
using System.Text;
using WebGis.Data.Contexts;

namespace WebGis.WebAPI.Extensions
{
	public static class WebApplicationExtensions
	{
		public static WebApplicationBuilder ConfigureServices(
			this WebApplicationBuilder builder)
		{

			builder.Services.AddMemoryCache();

			builder.Services.AddDbContext<WebDbContext>(options =>
			options.UseNpgsql(
				builder.Configuration.GetConnectionString("LacDuongDb")));

			builder.Services.AddScoped<IDataSeeder, DataSeeder>();


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
				scope.ServiceProvider.GetRequiredService<IDataSeeder>().Initialize();
			}
			catch (Exception e)
			{
				scope.ServiceProvider.GetRequiredService<ILogger<Program>>()
					.LogError(e, "Count not insert data into database");
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

			app.UseAuthentication();
			app.UseAuthorization();

			app.UseCors("WebGisApp");

			return app;
		}

	}
}
