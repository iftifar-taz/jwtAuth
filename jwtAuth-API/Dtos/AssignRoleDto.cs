using System.ComponentModel.DataAnnotations;

namespace jwtAuth_API.Dtos
{
    public class AssignRoleDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string RoleId { get; set; } = string.Empty;
    }
}