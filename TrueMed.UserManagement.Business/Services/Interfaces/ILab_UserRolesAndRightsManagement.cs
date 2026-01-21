using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;
using TrueMed.UserManagement.Domain.Models.Dtos.Response;

namespace TrueMed.UserManagement.Business.Services.Interfaces
{
    public interface ILab_UserRolesAndRightsManagement
    {
        #region Queries
        Task<RequestResponse<List<GetModuleWithPageResponse>>> GetModuleAndClaimsByRoleIdAsync(int? roleId);
        Task<RequestResponse<List<GetModuleWithPageResponse>>> GetModuleAndClaimsByUserIdAsync(string? userId);
        #endregion

        #region Commands
        Task<RequestResponse> AddOREditRoleClaims(AddOREditClaimRequest request);
        #endregion

        #region Lookups
        Task<List<CommonLookupResponse>> GetUserRoles_Lookup_Async();
        #endregion
    }
}
