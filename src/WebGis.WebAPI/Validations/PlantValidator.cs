using FluentValidation;
using WebGis.WebAPI.Models;

namespace WebGis.WebAPI.Validations
{
	public class PlantValidator : AbstractValidator<PlantEditModel>
	{
        public PlantValidator()
        {
			RuleFor(c => c.Name)
				.NotEmpty()
				.WithMessage("Tên chủ đề không được để trống")
				.MaximumLength(128)
				.WithMessage("Tên chủ đề tối đa 128 ký tự");

			RuleFor(c => c.Description)
				.NotEmpty()
				.MaximumLength(5000);

			RuleFor(c => c.CategoryId)
				.NotEmpty()
				.Must(TryParseGuid);
		}
		public static bool TryParseGuid(Guid guidString)
		{
			if (guidString != Guid.Empty)
			{
				if (Guid.TryParse(guidString.ToString(), out _))
				{
					return true;
				}
				else
					return false;
			}

			return false;
		}
	}
}
