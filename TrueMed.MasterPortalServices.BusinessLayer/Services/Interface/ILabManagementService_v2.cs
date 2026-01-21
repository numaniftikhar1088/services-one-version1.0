using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface ILabManagementService_v2
    {
        DataQueryResponse<List<LabManagementRespone_v2.GetReferenceLabAssignmentResponse>> GetReferenceLabAssignment(DataQueryModel<LabManagementQueryModel.GetReferenceLabAssignmentQM> query);
        RequestResponse ReferenceAssignmentStatusChanged(LabManagementRequest_v2.StatusChangedRequest request);
    }
}
