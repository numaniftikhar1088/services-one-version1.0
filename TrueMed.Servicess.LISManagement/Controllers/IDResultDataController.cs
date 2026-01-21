using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Busines.Interfaces;
using TrueMed.LISManagement.Domain.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domain.DTOS.Response;
using TrueMed.LISManagement.Domains.DTOS.Request;
using TrueMed.LISManagement.Domains.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.Servicess.LISManagement.Controllers
{
    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class IDResultDataController : ControllerBase
    {
        private readonly IIDResultDataService _resultDataService;
        public IDResultDataController(IIDResultDataService resultDataService)
        {
            _resultDataService = resultDataService;
        }

        [HttpPost("GetAll")]
        public ActionResult<DataQueryResponse<List<IDResultDataResponse>>> GetAll(DataQueryModel<IDResultDataQueryModel> query)
        {
            return _resultDataService.CombineResultDataWithExpand(query);
        }
        [HttpPost("Archive")]
        public ActionResult<RequestResponse> Archive(int[] selectedIds)
        {
            return _resultDataService.Archive(selectedIds);
        }
        [HttpPost("Restore")]
        public ActionResult<RequestResponse> Restore(int[] selectedIds)
        {
            return _resultDataService.Restore(selectedIds);
        }
        [HttpPost("ExportToExcel")]
        public ActionResult<RequestResponse<FileContentResult>> IDResultDataExportToExcel(int[] selectedRows)
        {
            return _resultDataService.IDResultDataExportToExcel(selectedRows);
        }
        [HttpGet("GetExpandData")]
        public RequestResponse<IDResultDataExpandResponse> GetIdResultDataExpand(string accessionNo)
        {
            return _resultDataService.GetIdResultDataExpand(accessionNo);
        }
        [HttpPost("ChangeControlsStatus")]
        public ActionResult<RequestResponse> ChangeControlsStatus(ChangeControlsStatusRequest request)
        {
            return _resultDataService.ChangeControlsStatus(request);
        }
        [HttpPost("ChangeOrganismStatus")]
        public ActionResult<RequestResponse> ChangeOrganismStatus(ChangeOrganismStatusRequest request)
        {
            return _resultDataService.ChangeOrganismStatus(request);
        }
        [HttpPost("PublishAndValidate")]
        public ActionResult<RequestResponse> PublishAndValidate(IDLISResultDataValidateRequest request)
        {
            return _resultDataService.PublishAndValidate(request);
        }
        [HttpPost("BulkPublishAndValidate")]
        public ActionResult<RequestResponse> BulkPublishAndValidate(IDLISResultDataValidateRequest[] request)
        {
            return _resultDataService.BulkPublishAndValidate(request);
        }
        [HttpPost("SaveIdResultDataExpand")]
        public ActionResult<RequestResponse> SaveIdResultDataExpand(IDLISResultDataExpandRequest request)
        {
            return _resultDataService.SaveIdResultDataExpand(request);
        }

        [HttpGet("GenerateBlanksAgainstReqOrderId")]
        public RequestResponse GenerateBlanksAgainstReqOrderId(int reqOrderId)
        {
            return _resultDataService.GenerateBlanksAgainstReqOrderId(reqOrderId);
        }
    }
}
