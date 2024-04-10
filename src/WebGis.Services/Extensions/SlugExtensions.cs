using Slugify;

namespace WebGis.Services.Extensions
{
	public static class SlugExtensions
	{
		public static string GenerateSlug(this string input)
		{
			var slugHelper = new SlugHelper();
			return slugHelper.GenerateSlug(input);
		}
	}
}
