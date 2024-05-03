using FluentValidation;
using WebGis.WebAPI.Models;

namespace WebGis.WebAPI.Validations
{
	public class PlantOutputValidator : AbstractValidator<PlantOutputEditModel>
	{
        public PlantOutputValidator()
        {
			RuleFor(x => x.Quantity)
				.NotEmpty()
				.WithMessage("Quantity is not empty");

			RuleFor(x => x.Unit)
				.NotEmpty()
				.WithMessage("Unit is not empty");


		}
    }
}
