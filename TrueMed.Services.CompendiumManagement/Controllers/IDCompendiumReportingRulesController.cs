using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Net;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed_Project_One_Service.Helpers;
using static TrueMed.CompendiumManagement.Domain.Models.Dtos.Response.IDCompendiumPanelMappingResponse;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/IDCompendiumReportingRules")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class IDCompendiumReportingRulesController : ControllerBase
    {
        private readonly IIDCompendiumReportingRulesService _service;
        public IDCompendiumReportingRulesController(IIDCompendiumReportingRulesService service)
        {
            _service = service;

        }
        [HttpPost("Save")]
        public async Task<RequestResponse> SaveIDCompendiumReportingRulesAsync(SaveIDCompendiumReportingRulesRequest request)
        {
            return await _service.SaveIDCompendiumReportingRulesAsync(request);
        }
        [HttpPost("GetAll")]
        public async Task<DataQueryResponse<List<IDCompendiumReportingRulesDetailedResponse>>> GetIDCompendiumAssayDataDetailAsync(DataQueryViewModel<IDCompendiumReportingRulesQueryModel> query)
        {
            return await _service.GetIDCompendiumReportingRulesDetailAsync(query);
        }
        [HttpGet("GetPanelsAndTestsById/{id:int}")]
        public async Task<RequestResponse<List<PanelAndTestResponse>>> GetPanelsAndTestsByIdAsync(int Id)
        {
            return await _service.GetPanelsAndTestsByIdAsync(Id);
        }
        [HttpGet("IDCompendiumDataReportingRuleTemplateDownload")]
        public ActionResult<byte[]> IDCompendiumDataReportingRuleTemplateDownload()
        {
            return _service.IDCompendiumDataReportingRuleTemplateDownload();
        }
        [HttpPost("ReportingRules_Export_To_Excel")]
        public IActionResult FacilityExportToExcel(int[]? selectedRow)
        {
            var result = _service.ReportingRulesExportToExcel(selectedRow);
            return Ok(result);

        }

    }
}
