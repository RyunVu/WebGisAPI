using FluentValidation;
using WebGis.WebAPI.Models;

namespace WebGis.WebAPI.Validations
{
	public class CommuneValidator : AbstractValidator<CommuneEditModel>
	{
        public CommuneValidator()
        {
			RuleFor(c => c.Name)
				.NotEmpty()
				.WithMessage("Tên chủ đề không được để trống")
				.MaximumLength(128)
				.WithMessage("Tên chủ đề tối đa 128 ký tự");

			RuleFor(c => c.Description)
				.NotEmpty()
				.MaximumLength(5000);

			RuleFor(x => x.Area)
				.NotEmpty()
				.WithMessage("Area is not empty");

			RuleFor(x => x.DistrictId)
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
