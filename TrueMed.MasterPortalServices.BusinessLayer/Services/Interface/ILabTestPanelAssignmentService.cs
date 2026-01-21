using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface ILabTestPanelAssignmentService
    {
        #region Commands
        Domain.Models.Response.RequestResponse Save(LabTestPanelAssignmentSaveRequest request);
        Domain.Models.Response.RequestResponse DeleteById(int id);
        #endregion
        #region Queries
        Domain.Models.Response.RequestResponse<LabTestPanelAssignmentSaveResponse> GetById(int id);
        DataQueryResponse<List<LabTestPanelAssignmentSaveResponse>> GetAll(DataQueryModel<LabTestPanelAssignmentQueryModel> query);
        #endregion
    }
}
