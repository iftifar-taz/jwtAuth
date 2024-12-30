using System.ComponentModel.DataAnnotations;

namespace jwtAuth_API.Dtos
{
    public class ForgetPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}