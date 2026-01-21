using Microsoft.AspNetCore.Mvc;
using TrueMed.Business.Interface;
using TrueMed.CompendiumManagement.Business.Implementation;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.Domain.Models.Datatable;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed_Project_One_Service.Helpers;
using static TrueMed.CompendiumManagement.Domain.Models.Dtos.Response.IDCompendiumPanelMappingResponse;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Required_X_Portal_Key(Order = int.MaxValue)]
    [HandleException]
    [Route("api/[controller]")]
    [ApiController]
    public class IDCompendiumPanelMappingController : ControllerBase
    {
        private readonly IIDCompendiumPanelMappingService _service;
        private readonly ILookupManager _lookupManager;

        public IDCompendiumPanelMappingController(
            IIDCompendiumPanelMappingService service,
            ILookupManager lookupManager)
        {
            _service = service;
            _lookupManager = lookupManager;
        }
        #region Queries
        [HttpPost("GetAll")]
        public ActionResult<DataQueryResponse<List<IDCompendiumPanelMappingResponse.GetAll>>> GetAll(DataQueryViewModel<IDCompendiumPanelMappingQM> query)
        {
            return _service.GetAll(query);
        }
        [HttpGet("GetPanelInfoById/{id:int}")]
        public async Task<RequestResponse<List<ReportingRuleInfo>>> GetPanelInfoById(int id)
        {
            return await _service.GetById(id);
        }
        [HttpPost("Save")]
        public async Task<RequestResponse> SavePanelMapping(SaveIDCompendiumPanelMappingRequest request)
        {
            return await _service.SavePanelMapping(request);
        }
        [HttpGet("AssayData/Lookup")]
        public async Task<RequestResponse<List<AssayDataLookup>>> assayDataLookupAsync()
        {
            return await _service.assayDataLookupAsync();
        }
        [HttpGet("ReportingRules/Lookup")]
        public async Task<RequestResponse<List<ReportingRulesLookup>>> ReportingRulesLookupAsync()
        {
            return await _service.ReportingRulesLookupAsync();
        }
        [HttpGet("Group/Lookup")]
        public async Task<List<CommonLookupResponse>> GroupLookupAsync()
        {
            return await _lookupManager.GroupLookup();
        }
        [HttpGet("ReferenceLab_Lookup")]
        public async Task<List<CommonLookupResponse>> ReferenceLabLookupAsync()
        {
            return await _lookupManager.ReferenceLabLookup();
        }
        #endregion
        [HttpPost("PanelMapping_Export_To_Excel")]
        public IActionResult FacilityExportToExcel(int[]? selectedRow)
        {
            var result = _service.PanelExportToExcel(selectedRow);
            return Ok(result);

        }

        [HttpPost("BulkPanelMappingUpload")]
        public IActionResult BulkPanelMappingUpload(FileDataRequest request)
        {
            var result = _service.BulkPanelMappingUpload(request);
            return Ok(result);

        }
    }
}
