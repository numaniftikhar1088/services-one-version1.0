using static TrueMed.Business.Services.IdentityModel.JwtHandler;

namespace TrueMed.Business.Interface
{
    public interface ITokenHelper
    {
         Task<object?> GenerateToken(IUserManagement userManager, UserValidationViewModel user);
        Task<object?> GetMenuForUser(IUserManagement _userManager);
        Task<object?> SelectedTenantToken(IUserManagement userManager, int labId);
    }
}
