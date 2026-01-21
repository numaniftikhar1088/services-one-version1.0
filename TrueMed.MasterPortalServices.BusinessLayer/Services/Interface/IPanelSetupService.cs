
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.LookupModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface IPanelSetupService
    {
        Task<RequestResponse> SavePanelSetupAsync(SavePanelSetupRequest request);
        Task<DataQueryResponse<List<GetPanelSetupDetailResponse>>> GetPanelSetupDetailAsync(DataQueryModel<PanelSetupQueryModel> query);
        Task<RequestResponse<GetPanelSetupDetailByIdResponse>> GetPanelSetupDetailByIdAsync(int id);
        Task<RequestResponse> DeletePanelSetupByIdAsync(int id);
        Task<RequestResponse> ChangePanelSetupStatusAsync(ChangePanelSetupStatusRequest request);


        Task<RequestResponse<List<PanelSetupLookup>>> PanelSetupLookupAsync();
        Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionTypeLookupAsync();
        Task<RequestResponse<List<DepartmentLookup>>> DepartmentLookupAsync();
    }
}
