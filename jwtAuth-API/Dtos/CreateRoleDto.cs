using System.ComponentModel.DataAnnotations;

namespace jwtAuth_API.Dtos
{
    public class CreateRoleDto
    {
        [Required(ErrorMessage = "Role name is required.")]
        public string? Name { get; set; }
    }
}