using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.LookupModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface IMenuManagement
    {

        #region Previous Code
        //RequestResponse Save(SaveMenuRequest request);
        //Task<DataQueryResponse<List<GetMenuResponse>>> GetMenusbyModule(DataQueryModel<MenuSetupQueryModel> query);
        //Task<RequestResponse> ChangeStatusAsync(ChangeMenuStatusRequest request);
        //Task<RequestResponse> ChangeVisibilityAsync(ChangeMenuVisibilityRequest request);
        //Task<RequestResponse<List<ModuleLookupModel>>> ModuleLookupAsync();
        //Task<RequestResponse> SaveOrUpdatMenuAsync(MenuRequest request);
        #endregion
        #region Commands
        RequestResponse<int> Save(MenuRequestV2.SaveMenuRequest request);
        #endregion
        #region Queries
        #endregion
        #region Lookups
        Task<List<CommonLookupResponse>> Module_Lookup();
        #endregion
    }
}
