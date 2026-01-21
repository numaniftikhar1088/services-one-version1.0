using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.Dtos;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.Service.InsuranceManagement.Controllers
{
    [Route("api/InsuranceAssignment")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Authorize]
    public class InsuranceAssignmentController : ControllerBase
    {
        private readonly IInsuranceAssignmentService _insuranceAssignmentService;
        private readonly ILookupManager _lookupManager;
        public InsuranceAssignmentController(IInsuranceAssignmentService insuranceAssignmentService, ILookupManager lookupManager)
        {
            _insuranceAssignmentService = insuranceAssignmentService;
            _lookupManager = lookupManager;
        }
        [HttpPost("SaveInsuranceAssignment")]
        public async Task<RequestResponse> SaveInsuranceAssignment(SaveInsuranceAssignmentDto insuranceAssignmentDto)
        {
            return await _insuranceAssignmentService.SaveInsuranceAssignmentAsync(insuranceAssignmentDto);
        }
        [HttpPost("StatusChange")]
        public async Task<RequestResponse> InsuranceAssignmentStatusChange(ChangeInsuranceAssignmentStatusDto insuranceAssignmentDto)
        {
            return await _insuranceAssignmentService.ChangeInsuranceAssignmentStatusAsync(insuranceAssignmentDto);
        }
        [HttpPost("GetInsuranceAssignmentDetailBasedOnSearch")]
        public async Task<DataQueryResponse<List<GetInsuranceAssignmentDetailsDto>>> GetInsuranceAssignmentDetailBasedOnSearch(DataQueryModel<GetInsuranceAssignmentDetailsQueryModel> query)
        {
            return await _insuranceAssignmentService.GetInsuranceAssignmentDetailBasedOnSearchAsync(query);
        }
        //[HttpPost("GetInsuranceAssignment")]
        //public async Task<DataQueryResponse<IQueryable>> GetInsuranceAssignment(DataQueryModel<InsuranceAssignmentQueryModel> dataQueryModel)
        //{
        //    return await _insuranceAssignmentService.GetInsuranceAssignmentAsync(dataQueryModel);
        //}
        [HttpDelete("DeleteInsuranceAssignment/{id:int}")]
        public async Task<RequestResponse> DeleteInsuranceAssignmentByIdAsync(int id)
        {
            return await _insuranceAssignmentService.DeleteInsuranceAssignmentByIdAsync(id);
        }
        //[HttpGet("GetInsuranceAssignmentById/{id:int}")]
        //public async Task<RequestResponse<GetInsuranceAssignmentDetailsByIdDto>> GetInsuranceAssignmentByIdAsync(int id)
        //{
        //    return await _insuranceAssignmentService.GetInsuranceAssignmentByIdAsync(id);
        //}


        #region Lookups Section Start
        [HttpGet("ControlOptionsByOptionId_Lookup")]
        public async Task<IActionResult> ControlOptionsByOptionId_Lookup([FromQuery] int optionId)
        {
            var result = await _lookupManager.ControlOptionsByOptionId_Lookup(optionId);
            return Ok(result);
        }
        #endregion End

    }
}
