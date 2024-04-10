using Carter;
using WebGis.WebAPI.Extensions;
using WebGis.WebAPI.Mapsters;
using WebGis.WebAPI.Validations;

var builder = WebApplication.CreateBuilder(args);
{
	builder
		.ConfigureCors()
		.ConfigureNLog()
		.ConfigureServices()
		.ConfigureSwaggerOpenApi()
		.ConfigureMapster()
		.ConfigureFluentValidation()
		.ConfigureJsonSerializer();
}

var app = builder.Build();
{
	app.SetupRequestPipeline();

	app.MapCarter();

	app.UseDataSeeder();


	app.Run();
}
