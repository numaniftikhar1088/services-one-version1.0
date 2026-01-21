using TrueMed.Domain.Models.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using RequestResponse = TrueMed.Domain.Models.Response.RequestResponse;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface ILab_ReferenceLabService
    {
        #region Commands
        RequestResponse Save(ReferenceLabRequest request);
        RequestResponse Delete(int id);
        RequestResponse StatusChanged(int id, bool status);
        #endregion
        #region Queries
        DataQueryResponse<List<GetAllReferenceLabResponse>> GetAll(DataQueryModel<ReferenceLabQueryModel> query);
        Domain.Models.Response.RequestResponse<GetByIdReferenceLabResponse> GetById(int id);
        #endregion
    }
}
