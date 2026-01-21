
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Identity;
using TrueMed.Domain.Models.LabRole;

namespace TrueMed.Business.Interface
{
    public interface ILabRoleManagement
    {
        Task<bool> DeleteRoleByIdAsync(int roleId);
        Task<bool> DeleteUserRoleByUserIdAsync(string userId);
        IQueryable<LabRoleModel> GetAllRoles();
        IQueryable<LabUserRoleModel> GetAllUserRoles();
        Task<RoleWithClaimsModel?> GetClaimsAndModulesWithRoleByRoleIdAsync(int roleId);
        Task<List<RoleWithClaimsModel>> GetRoleWihClaimsAsync(string? roleName, string? SortDirection);
        Task<ICollection<ClaimModel>> GetClaimsByIdsAsync(params int[] claimIds);
        Task<int[]> GetClaimsByRoleIdAsync(int roleId);
        Task<int[]> GetClaimsIdsByUserIdAsync(string userId);
        Task<string[]> GetClaimsNamesByUserIdAsync(string userId);
        Task<ModuleAndClaimsModel[]> GetModuleWithClaimsAsync();
        Task<LabRoleModel?> GetRoleByIdAsync(int roleId);
        Task<LabRoleModel?> GetRoleByNameAsync(string roleName);
        Task<LabRoleModel?> GetRoleByUserIdAsync(string userId);
        Task<int?> GetRoleIdByNameAsync(string roleName);
        Task<int> GetUserCountByRoleIdAsync(int roleId);
        Task<bool> HasAllClaimsByIdAsync(params int[] claimIds);
        Task<bool> IsRoleExistsByIdAsync(int roleId);
        Task<bool> IsRoleExistsByNameAsync(string roleName);
        Task<bool> IsRoleNameValidAsync(KeyValuePairViewModel<int> uniqueKeyValidation);
        Task<bool> IsUserAnyRoleExistsByUserIdAsync(string userId);
        Task<IdentityResult> SaveOrUpdateRoleAndClaimsAsync(RoleViewModel roleViewModel);
        Task<IdentityResult> UpdateUserClaimsByUserIdAsync(string userId, params int[] claimsIds);
        Task<IdentityResult> UpdateUserRoleAndClaimsByUserIdAsync(UserRoleClaimViewModel userRoleClaimViewModel);
    }
}
