
using TrueMed.Domain.Models.Identity;
using TrueMed.UserManagement.Domain.Models.Account.Response;
using TrueMed.UserManagement.Domain.Models.Dtos.Response;

namespace TrueMed.UserManagement.Domain.Repositories.Identity.Interface
{
    public interface ILabMenuManagement
    {
        Task<RequestResponse> AddUserFavouriteMenuAsync(AddUserFavouriteIconVM addUserFavouriteIcon);
        Task<RequestResponse> RemoveUserFavouriteMenuAsync(RemoveUserFavouriteIconVM removeUserFavouriteIcon);
        Task<TrueMed.Domain.Models.Response.RequestResponse<List<GetUserFavouriteMenuResponse>>> GetUserFavouriteMenuAsync();
    }
}
