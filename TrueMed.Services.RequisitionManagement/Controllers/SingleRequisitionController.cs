using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Route("api/SingleRequisition")]
    [Authorize]
    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [ApiController]
    public class SingleRequisitionController : ControllerBase
    {
        private readonly ISingleRequistionService _singleRequistionService;
        private readonly ILookupManager _lookupManager;

        public SingleRequisitionController(ISingleRequistionService singleRequistionService, ILookupManager lookupManager)
        {
            _singleRequistionService = singleRequistionService;
            _lookupManager = lookupManager;
        }
        [HttpPost("SaveSingleRequisition")]
        public async Task<RequestResponse> SaveSingleRequisition(SaveSingleRequistionRequest request)
        {
            return await _singleRequistionService.SaveSingleRequisitionAsync(request);
        }
        [HttpDelete("DeleteSingleRequisitionById/{id:int}")]
        public async Task<RequestResponse> DeleteSingleRequisitionById(int id)
        {
            return await _singleRequistionService.DeleteSingleRequisitionByIdAsync(id);
        }
        [HttpGet("FacilityLookupForRequisition")]
        public RequestResponse<List<FacilityLookupForRequsitionResponse>> FacilityLookupForRequisition()
        {
            return _singleRequistionService.FacilityLookupForRequisition();
        }
        [HttpGet("CollectorLookupBasedOnFacilityId")]
        public async Task<List<CollectorLookupBasedOnFacilityIdResponse>> FacilityLookupForRequisition([FromQuery] int id)
        {
            return await _lookupManager.CollectorLookupBasedOnFacilityId(id);
        }
    }
}
