using System.ComponentModel.DataAnnotations;

namespace jwtAuth_API.Dtos
{
    public class RefreshTokenDto
    {
        public string Email { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
    }
}
