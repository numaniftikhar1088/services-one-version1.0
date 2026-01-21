using TrueMed.Domain.Models.Response;
using TrueMed.UserManagement.Domain.Models.Dtos.Response;

namespace TrueMed.UserManagement.Business.Services.Interfaces
{
    public interface ILab_MenuManagement
    {
        RequestResponse<ModuleWithClaimsResponse> MenusByUserIdForLabSide();
    }
}
