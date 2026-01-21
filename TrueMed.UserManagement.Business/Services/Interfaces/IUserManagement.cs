using TrueMed.Domain.Models.Response;
using TrueMed.UserManagement.Domain.Models.Dtos.Request;
using TrueMed.UserManagement.Domain.Models.Dtos.Response;
using TrueMed.UserManagement.Domain.Models.QueryModels.Request;
using TrueMed.UserManagement.Domain.Models.QueryModels.Request.Base;
using TrueMed.UserManagement.Domain.Models.QueryModels.Response;
using TrueMed.UserManagement.Domain.Models.QueryModels.Response.Base;

namespace TrueMed.UserManagement.Business.Services.Interfaces
{
    public interface IUserManagement
    {
        #region Query
        DataQueryResponse<List<UserResponseQueryModel>> GetAllUser(DataQueryRequest<UserRequestQueryModel> dataQuery);
        DataQueryResponse<List<FacilityUserResponseQueryModel>> GetAllFacilityUser(DataQueryRequest<FacilityUserRequestQueryModel> dataQuery);
        RequestResponse<GetFacilityUserInfoAgainstUserIdResponse> GetFacilityUserAganistUserId(string id);
        //RequestResponse Lab_GetRolesW();

        #endregion
        #region Commands
        RequestResponse FacilityUserStatusChange(string userId, bool status);
        RequestResponse UserStatusChange(string userId, bool status);
        RequestResponse CreateFacilityUser(FacilityUserCreateRequest request);
        RequestResponse RemoveFacilityUser(string Id);
        RequestResponse UserRemove(string Id);
        RequestResponse CreateFacilityProvider(AddProviderRequest req);
        #endregion
    }
}
