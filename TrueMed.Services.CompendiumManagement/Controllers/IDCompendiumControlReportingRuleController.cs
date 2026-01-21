using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class IDCompendiumControlReportingRuleController : ControllerBase
    {
        private readonly IIDCompendiumControlReportingRuleService _service;
        public IDCompendiumControlReportingRuleController(IIDCompendiumControlReportingRuleService service)
        {
            _service = service;

        }
        [HttpPost("Save")]
        public async Task<RequestResponse> SaveIDCompendiumControlReportingRulesAsync(IDCompendiumControlReportingRuleResponse request)
        {
            return await _service.SaveIDCompendiumControlReportingRulesAsync(request);
        }
        [HttpPost("GetAll")]
        public async Task<DataQueryResponse<List<IDCompendiumControlReportingRuleResponse>>> GetIDCompendiumAssayDataDetailAsync(DataQueryViewModel<IDCompendiumControlReportingRulesQueryModel> query)
        {
            return await _service.GetIDCompendiumControlReportingRulesAsync(query);
        }

        [HttpPost("SavePanels")]
        public async Task<RequestResponse> SaveIDCompendiumControlReportingRulePanels(SaveIDCompendiumControlReportingRulePanels request)
        {
            return await _service.SaveIDCompendiumControlReportingRulePanels(request);
        }
    }
}
