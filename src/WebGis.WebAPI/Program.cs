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
		.ConfigureFluentValidation();
}

var app = builder.Build();
{
	app.SetupRequestPipeline();

	app.UseDataSeeder();

	if (app.Environment.IsDevelopment())
	{
		app.UseSwagger();
		app.UseSwaggerUI();
	}

	app.UseStaticFiles();

	app.UseHttpsRedirection();

	app.UseCors("");

	//app.MapProductEndpoints();
	//app.MapAccountEndPoints();
	//app.MapCategoryEndpoints();
	//app.MapUnitEndpoints();


	app.Run();
}
