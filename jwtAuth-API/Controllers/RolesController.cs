using jwtAuth_API.Dtos;
using jwtAuth_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jwtAuth_API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    // api/roles
    public class RolesController(
        UserManager<AppUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration) : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;
        private readonly IConfiguration _configuration = configuration;

        [HttpPost]
        // api/roles
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
        {
            if (string.IsNullOrWhiteSpace(createRoleDto.Name))
            {
                return BadRequest("Role name is required.");
            }

            var roleExist = await _roleManager.RoleExistsAsync(createRoleDto.Name);
            if (roleExist)
            {
                return BadRequest("Role already exist.");
            }

            var result = await _roleManager.CreateAsync(new IdentityRole(createRoleDto.Name));

            if (result.Succeeded)
            {
                return Ok(new {message = "Role created successfully"});
            }

            return BadRequest("Role creation failed.");
        }

        [HttpGet]
        // api/roles
        public async Task<ActionResult<IEnumerable<RoleResponseDto>>> GetRoles()
        {
            var roles = await _roleManager.Roles.Select(x => new RoleResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                TotalUsers = _userManager.GetUsersInRoleAsync(x.Name!).Result.Count
            }).ToListAsync();

            return Ok(roles);
        }

        [AllowAnonymous]
        [HttpGet("registration")]
        // api/roles/registration
        public async Task<ActionResult<IEnumerable<RoleResponseDto>>> GetRegistrationRoles()
        {
            var roles = await _roleManager.Roles.Select(x => new RegistrationRoleResponseDto
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync();

            return Ok(roles);
        }

        [HttpDelete("{id}")]
        // api/roles/{id}
        public async Task<IActionResult> DeleteRole([FromRoute] string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role is null)
            {
                return BadRequest("Role not found");
            }

            var result = await _roleManager.DeleteAsync(role);
            if (result.Succeeded)
            {
                return Ok(new {message = "Role deleted successfully"});
            }

            return BadRequest("Role deletion failed");
        }

        [HttpPatch("assign")]
        // api/roles/assign
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto assignRoleDto)
        {
            var user = await _userManager.FindByIdAsync(assignRoleDto.UserId);
            if (user is null)
            {
                return BadRequest("User not found.");
            }

            var role = await _roleManager.FindByIdAsync(assignRoleDto.RoleId);
            if (role is null)
            {
                return BadRequest("Role not found.");
            }

            var result = await _userManager.AddToRoleAsync(user, role.Name!);
            if (result.Succeeded)
            {
                return Ok(new {message = "Role assigned successfully"});
            }

            var error = result.Errors.FirstOrDefault();
            return BadRequest(error!.Description);
        }
    }
}