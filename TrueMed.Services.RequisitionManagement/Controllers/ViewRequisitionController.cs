using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.FeatureManagement.Mvc;
using System.Net;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Datatable;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class ViewRequisitionController : ControllerBase
    {
        private readonly IViewRequisitionService _viewRequisitionService;

        public ViewRequisitionController(IViewRequisitionService viewRequisitionService)
        {
            _viewRequisitionService = viewRequisitionService;
        }

        [HttpPost("ViewRequisition")]
        public IActionResult ViewRequisition(DynamicDataGridRequest<DynamicDataFilter> query)
        {
            var response = _viewRequisitionService.ViewRequisition(query);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpPost("StatusChanged")]
        public IActionResult StatusChanged(ViewRequisitionStatusChangedRequest request)
        {
            var response = _viewRequisitionService.StatusChanged(request);

            if (response.HttpStatusCode == Status.Success)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpDelete("RemoveViewRequisittion")]
        public IActionResult RemoveViewRequisittion([FromQuery] int id)
        {
            var response = _viewRequisitionService.RemoveViewRequisition(id);

            if (response.HttpStatusCode == Status.Success)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpPost("NextStepAction")]
        public IActionResult NextStepAction([FromForm] updateNextStepStatus request)
        {
            var response = _viewRequisitionService.NextStepButton(request);

            if (response.HttpStatusCode == Status.Success)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }
        [HttpPost("Export_To_Excel")]
        public IActionResult ExportToExcel(ViewRequisitionExportToExcel request)
        {
            var result = _viewRequisitionService.ViewRequisitionExportToExcel(request);
            return Ok(result);

        }
        [HttpPost("Export_To_ExcelV2")]
        public IActionResult ExportToExcelV2(DynamicDataGridRequest<DynamicDataFilter> request)
        {
            var response = _viewRequisitionService.ViewRequisitionExportToExcelV2(request);
            return StatusCode((int)HttpStatusCode.OK, response);

        }
        [HttpGet("Restore/{id:int}")]
        public IActionResult Restore(int id)
        {
            var result = _viewRequisitionService.Restore(id);
            return Ok(result);
        }
        [HttpGet("GetPrintersInfo")]
        public IActionResult GetPrintersInfo()
        {
            var result = _viewRequisitionService.GetPrintersInfo();
            return Ok(result);
        }
        [HttpPost("FileUpload")]
        public async Task<IActionResult> UploadFile(ViewRequisitionUploadFileRequest request)
        {
            var response = await _viewRequisitionService.UploadFile(request);

            if (response.HttpStatusCode == Status.Success)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }


        [HttpGet("GetColumns")]
        public IActionResult GetColumns()
        {
            var result = _viewRequisitionService.GetColumns();
            return Ok(result);
        }
        [HttpPost("SaveColumns")]
        public IActionResult SaveColumns(List<ViewRequisitionColumnsResponse> request)
        {
            var response = _viewRequisitionService.SaveColumns(request);

            if (response.HttpStatusCode == Status.Success)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }

        [HttpGet("TabsConfiguration")]
        public IActionResult TabsConfiguration(int PageId)
        {
            var response = _viewRequisitionService.GetTabsConfiguration(PageId);

            if (response.HttpStatusCode == Status.Success)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);

        }


    }
}
