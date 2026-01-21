using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.UserManagement.Business.Services.Interfaces;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;
using TrueMed.UserManagement.Domain.Models.Dtos.Response;

namespace TrueMed.Services.UserManagement.Controllers
{
    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class Lab_UserRolesAndRightsController : ControllerBase
    {
        private readonly ILab_UserRolesAndRightsManagement _lab_UserRolesAndRightsManagement;

        public Lab_UserRolesAndRightsController(ILab_UserRolesAndRightsManagement lab_UserRolesAndRightsManagement)
        {
            _lab_UserRolesAndRightsManagement = lab_UserRolesAndRightsManagement;
        }

        #region Queries
        [HttpGet("GetModuleAndClaimsByRoleId")]
        public async Task<RequestResponse<List<GetModuleWithPageResponse>>> GetModuleAndClaimsByRoleId([FromQuery] int? roleId)
        {
            return await _lab_UserRolesAndRightsManagement.GetModuleAndClaimsByRoleIdAsync(roleId);
        }
        [HttpGet("GetModuleAndClaimsByUserId")]
        public async Task<RequestResponse<List<GetModuleWithPageResponse>>> GetModuleAndClaimsByUserId([FromQuery] string? userId)
        {
            return await _lab_UserRolesAndRightsManagement.GetModuleAndClaimsByUserIdAsync(userId);
        }
        #endregion

        #region Commands
        [HttpPost("AddOREditRoleClaim")]
        public async Task<RequestResponse<object>> AddOREditRoleClaims(AddOREditClaimRequest request)
        {
            return await _lab_UserRolesAndRightsManagement.AddOREditRoleClaims(request);
        }
        #endregion

        #region Lookups
        [HttpGet("Roles_Lookup")]
        public async Task<List<CommonLookupResponse>> GetUserRoles_Lookup()
        {
            return await _lab_UserRolesAndRightsManagement.GetUserRoles_Lookup_Async();
        }
        #endregion
    }
}
