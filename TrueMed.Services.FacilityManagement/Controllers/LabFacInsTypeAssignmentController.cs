using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;

namespace TrueMed.Services.FacilityManagement.Controllers
{
    [Route("api/LabFacInsTypeAssignment")]
    [ApiController]
    [Authorize]
    public class LabFacInsTypeAssignmentController : ControllerBase
    {
        private readonly ILabFacInsTypeAssignmentService _labFacInsTypeAssignmentService;
        public LabFacInsTypeAssignmentController(ILabFacInsTypeAssignmentService labFacInsTypeAssignmentService)
        {
            _labFacInsTypeAssignmentService = labFacInsTypeAssignmentService;
        }
        [HttpPost("SaveLabFacInsTypeAssignement")]
        public async Task<RequestResponse> SaveLabFacInsTypeAssignement(SaveLabFacInsTypeAssignementRequest request)
        {
            return await _labFacInsTypeAssignmentService.SaveLabFacInsTypeAssignementAsync(request);
        }
        [HttpPost("GetLabFacInsTypeAssignementDetail")]
        public async Task<DataQueryResponse<List<GetLabFacInsTypeAssignementDetailResponse>>> GetLabFacInsTypeAssignementDetail(DataQueryModel<LabFacInsTypeAssignementQueryModel> query)
        {
            return await _labFacInsTypeAssignmentService.GetLabFacInsTypeAssignementDetailAsync(query);
        }
        [HttpGet("GetLabFacInsTypeAssignementDetailById/{id:int}")]
        public async Task<RequestResponse<GetLabFacInsTypeAssignementDetailByIdResponse>> GetLabFacInsTypeAssignementDetailById(int id)
        {
            return await _labFacInsTypeAssignmentService.GetLabFacInsTypeAssignementDetailByIdAsync(id);
        }
        [HttpDelete("DeleteLabFacInsTypeAssignementById/{id:int}")]
        public async Task<RequestResponse> DeleteLabFacInsTypeAssignementById(int id)
        {
            return await _labFacInsTypeAssignmentService.DeleteLabFacInsTypeAssignementByIdAsync(id);
        }
        [HttpPost("ChangeLabFacInsTypeAssignementStatus")]
        public async Task<RequestResponse> ChangeLabFacInsTypeAssignementStatus(ChangeLabFacInsTypeAssignementStatusRequest request)
        {
            return await _labFacInsTypeAssignmentService.ChangeLabFacInsTypeAssignementStatusAsync(request);
        }
    }
}
