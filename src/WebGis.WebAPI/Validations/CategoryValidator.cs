using FluentValidation;
using WebGis.WebAPI.Models;

namespace WebGis.WebAPI.Validations
{
	public class CategoryValidator : AbstractValidator<CategoryEditModel>
	{
        public CategoryValidator()
        {
			RuleFor(c => c.Name)
				.NotEmpty()
				.WithMessage("Tên chủ đề không được để trống")
				.MaximumLength(128)
				.WithMessage("Tên chủ đề tối đa 128 ký tự");

			RuleFor(c => c.Description)
				.NotEmpty()
				.MaximumLength(5000);
		}
    }
}
