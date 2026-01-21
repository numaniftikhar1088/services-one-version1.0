using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RequisitionTypeController : ControllerBase
    {
        private readonly IRequisitionTypeService _requisitionTypeService;
        public RequisitionTypeController(IRequisitionTypeService requisitionTypeService)
        {
            _requisitionTypeService = requisitionTypeService;
        }
        [HttpPost("SaveRequisitionType")]
        public async Task<RequestResponse> SaveRequisitionType(SaveRequisitionTypeRequest request)
        {
            return await _requisitionTypeService.SaveRequisitionTypeAsync(request);
        }
        [HttpPost("GetRequisitionTypes")]
        public async Task<DataQueryResponse<List<GetRequisitionTypeResponse>>> GetTestSetupDetailAsync(DataQueryModel<RequisitionTypeQueryModel> query)
        {
            return await _requisitionTypeService.GetRequisitionTypesAsync(query);
        }
        [HttpPost("ChangeRequisitionTypeStatus")]
        public async Task<RequestResponse> ChangeRequisitionTypeStatus(ChangeRequisitionTypeStatusRequest request)
        {
            return await _requisitionTypeService.ChangeRequisitionTypeStatusAsync(request);
        }
        [HttpDelete("DeleteRequisitionTypeById/{id:int}")]
        public async Task<RequestResponse> DeleteRequisitionTypeById(int id)
        {
            return await _requisitionTypeService.DeleteRequisitionTypeByIdAsync(id);
        }
        [HttpPost("IsRquisitionTypeNameUnique")]
        public async Task<bool> IsRquisitionTypeNameUnique(string name)
        {
            return await _requisitionTypeService.IsRequisitionNameValid(name);
        }

    }
}
