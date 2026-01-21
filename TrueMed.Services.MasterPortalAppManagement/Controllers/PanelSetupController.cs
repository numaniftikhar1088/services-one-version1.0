using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.LookupModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Route("api/PanelSetup")]
    [ApiController]
    [Authorize]
    public class PanelSetupController : ControllerBase
    {
        private readonly IPanelSetupService _panelSetupService;
        public PanelSetupController(IPanelSetupService panelSetupService)
        {
            _panelSetupService = panelSetupService;
        }
        [HttpPost("SavePanelSetup")]
        public async Task<RequestResponse> SavePanelSetup(SavePanelSetupRequest request)
        {
            return await _panelSetupService.SavePanelSetupAsync(request);
        }
        [HttpPost("GetPanelSetupDetail")]
        public async Task<DataQueryResponse<List<GetPanelSetupDetailResponse>>> GetPanelSetupDetail(DataQueryModel<PanelSetupQueryModel> query)
        {
            return await _panelSetupService.GetPanelSetupDetailAsync(query);
        }
        [HttpGet("GetPanelSetupDetailById/{id:int}")]
        public async Task<RequestResponse<GetPanelSetupDetailByIdResponse>> GetPanelSetupDetailById(int id)
        {
            return await _panelSetupService.GetPanelSetupDetailByIdAsync(id);
        }
        [HttpDelete("DeletePanelSetupById/{id:int}")]
        public async Task<RequestResponse> DeletePanelSetupById(int id)
        {
            return await _panelSetupService.DeletePanelSetupByIdAsync(id);
        }
        [HttpPost("ChangePanelSetupStatus")]
        public async Task<RequestResponse> ChangePanelSetupStatus(ChangePanelSetupStatusRequest request)
        {
            return await _panelSetupService.ChangePanelSetupStatusAsync(request);
        }


        [HttpGet("PanelSetupLookup")]
        public async Task<RequestResponse<List<PanelSetupLookup>>> PanelSetupLookup()
        {
            return await _panelSetupService.PanelSetupLookupAsync();
        }
        [HttpGet("RequisitionTypeLookup")]
        public async Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionTypeLookup()
        {
            return await _panelSetupService.RequisitionTypeLookupAsync();
        }
        [HttpGet("DepartmentLookup")]
        public async Task<RequestResponse<List<DepartmentLookup>>> DepartmentLookup()
        {
            return await _panelSetupService.DepartmentLookupAsync();
        }
    }
}
