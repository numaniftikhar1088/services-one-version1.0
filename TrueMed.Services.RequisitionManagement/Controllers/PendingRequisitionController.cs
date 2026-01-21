using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.RequisitionManagement.Business.Services.Implementation;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [ApiController]
    public class PendingRequisitionController : ControllerBase
    {
        private readonly IPendingRequisitionService _pendingRequisitionService;

        public PendingRequisitionController(IPendingRequisitionService pendingRequisitionService)
        {
            _pendingRequisitionService = pendingRequisitionService;
        }
        [HttpPost("IncompleteRequisition")]
        public ActionResult<DataQueryResponse<List<IncompleteRequisitionResponse>>> IncompleteRequisition(DataQueryModel<IncompleteRequisitionQM> query)
        {
            return _pendingRequisitionService.IncompleteRequisition(query);
        }
        [HttpPost("WaitingForSignature")]
        public ActionResult<DataQueryResponse<List<WaitingForSignatureResponse>>> WaitingForSignature(DataQueryModel<WaitingForSignatureQM> query)
        {
            return _pendingRequisitionService.WaitingForSignature(query);
        }
        [HttpGet("Physician_Lookup")]
        public ActionResult<dynamic> Physician_Lookup()
        {
            return _pendingRequisitionService.Physician_Lookup();
        }
        [HttpDelete("Delete")]
        public RequestResponse Delete([FromQuery] int id)
        {
            return _pendingRequisitionService.Delete(id);
        }
        [HttpPost("WaitingForSignatureSave")]
        public RequestResponse WaitingForSignatureSave(WaitingForSignatureSaveRequest request)
        {
            return _pendingRequisitionService.WaitingForSignatureSave(request);
        }
        [HttpPost("Export_To_Excel")]
        public IActionResult ExportToExcel(int[]? selectedRow)
        {
            var result = _pendingRequisitionService.IncompleteRequisitionExportToExcel(selectedRow);
            return Ok(result);

        }

    }
}
