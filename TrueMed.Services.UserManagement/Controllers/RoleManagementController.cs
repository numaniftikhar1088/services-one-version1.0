using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.LabRole;

namespace TrueMed.Services.UserManagement.Controllers
{
    public partial class Lab_AccountController
    {
        [Route("ModuleWithClaims")]
        [HttpGet]
        public async Task<IActionResult> ModuleWithClaims()
        {
            var moduleWithClaims = await _roleManagement.GetModuleWithClaimsAsync();
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, moduleWithClaims);
        }

        [Route("Role/{roleId:int}/Claims")]
        [HttpGet]
        public async Task<IActionResult> GetRoleWihClaimsById(int roleId)
        {
            var rolesWithClaims = await _roleManagement.GetClaimsAndModulesWithRoleByRoleIdAsync(roleId);
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, rolesWithClaims);
        }

        [HttpPost("Role/Create")]
        public async Task<IActionResult> SaveRoleAndClaims(RoleViewModel roleViewModel)
        {
            var roleResult = await _roleManagement.SaveOrUpdateRoleAndClaimsAsync(roleViewModel);
            return _aPIResponseViewModel.Create(roleResult);
        }

        [Route("Role/All")]
        [HttpGet]
        public async Task<IActionResult> GetAllRoleWihClaims([FromQuery] string? roleName, string? SortDirection)
        {
            var rolesWithClaims = await _roleManagement.GetRoleWihClaimsAsync(roleName,SortDirection);
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, rolesWithClaims);
        }

        [HttpGet("Roles/Lookup")]
        public async Task<IActionResult> GetAllRole()
        {
            var roles = await _roleManagement.GetAllRoles().Select(x => new { UserGroupId = x.Id, x.Name }).OrderBy(o => o.Name).ToListAsync();
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, roles);
        }

        [HttpDelete("Role/{roleId:int}/Delete")]
        public async Task<IActionResult> DeleteRoleById(int roleId)
        {
            var roleResult = await _roleManagement.DeleteRoleByIdAsync(roleId);
            return _aPIResponseViewModel.Create(roleResult);
        }

        [HttpPut("Role/Update")]
        public async Task<IActionResult> UpdateRoleAndClaims(UpdateRoleViewModel roleViewModel)
        {
            var roleResult = await _roleManagement.SaveOrUpdateRoleAndClaimsAsync(roleViewModel);
            return _aPIResponseViewModel.Create(roleResult);
        }

        [Route("User/Claims")]
        [HttpGet]
        public async Task<IActionResult> GetClaimsAsync(string? userId = "")
        {
            userId = string.IsNullOrWhiteSpace(userId) ? User.GetUserId() : userId;
            var claims = await _roleManagement.GetClaimsNamesByUserIdAsync(userId);
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, claims);
        }



    }
}
