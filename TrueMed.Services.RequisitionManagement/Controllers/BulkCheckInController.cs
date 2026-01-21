using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Net;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.RequisitionManagement.Business.Services.Implementation;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class BulkCheckInController : ControllerBase
    {
        private readonly IBulkCheckInService _iBulkCheckInService;

        public BulkCheckInController(IBulkCheckInService iBulkCheckInService)
        {
            _iBulkCheckInService = iBulkCheckInService;
        }
        [HttpPost("DigitalCheckIn")]
        public IActionResult DigitalCheckIn(DigitalCheckINRecordRequest request)
        {
            var response = _iBulkCheckInService.GetDigitalCheckINRecord(request).GetAwaiter().GetResult();

            if (response.HttpStatusCode == Status.Success)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpPost("GetScanHistory")]
        public IActionResult GetScanHistory(DataQueryModel<ScanHistoryQueryModel> query)
        {
            var response = _iBulkCheckInService.GetScanHistory(query);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpGet("UndoCheckIn/{id:int}")]
        public IActionResult UndoCheckIn(int id)
        {
            var response = _iBulkCheckInService.UndoCheckIn(id).GetAwaiter().GetResult();

            if (response.HttpStatusCode == Status.Success)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpPost("GetPendingDataEntry")]
        public IActionResult GetPendingDataEntry(DataQueryModel<PendingDataEntryQueryModel> query)
        {
            var response = _iBulkCheckInService.GetPendingDataEntry(query);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpDelete("DeletePendingDataEntry/{reqOrderId:int}")]
        public IActionResult DeletePendingDataEntry(int reqOrderId)
        {
            var response = _iBulkCheckInService.DeletePendingDataEntry(reqOrderId);

            if (response.HttpStatusCode == Status.Success)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpGet("GetPhysiciansLookup/{id:int}")]
        public IActionResult GetPhysiciansLookup(int id)
        {
            var response = _iBulkCheckInService.GetPhysiciansLookup(id);

                return StatusCode((int)HttpStatusCode.OK, response);

        }
       
        [HttpGet("RequisitionType_Lookup")]
        public async Task<List<CommonLookupResponse>> RequisitionType_Lookup()
        {
            return await _iBulkCheckInService.RequisitionType_Lookup();
        }
        [HttpGet("Insurance_Lookup")]
        public async Task<RequestResponse<List<CommonLookupResponse>>> Insurance_Lookup()
        {
            return await _iBulkCheckInService.Insurance_Lookup();

        }
        [HttpGet("Panel_Lookup/{reqTypeId:int}")]
        public Task<List<CommonLookupResponse>> Panel_Lookup(int reqTypeId)
        {
            var response = _iBulkCheckInService.Panel_Lookup(reqTypeId);
            return response;

        }
    }
}
