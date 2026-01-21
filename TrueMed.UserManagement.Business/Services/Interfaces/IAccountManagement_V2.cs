using TrueMed.Domain.Models.Response;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;

namespace TrueMed.UserManagement.Business.Services.Interfaces
{
    public interface IAccountManagement_V2
    {
        #region Command
        Task<RequestResponse> GenerateTokenForResetPsswordAsync(string email, string? portal);
        Task<RequestResponse> ResetPsswordAsync(ResetPasswordRequest request);
        Task<RequestResponse> ChangePasswordAsync(ChangePasswordRequest request);
        Task<RequestResponse> InitializePsswordAsync(InitializePasswordRequest request);
        #endregion
    }
}
