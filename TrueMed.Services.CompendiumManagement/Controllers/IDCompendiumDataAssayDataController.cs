using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/IDCompendiumDataAssayData")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class IDCompendiumDataAssayDataController : ControllerBase
    {
        private readonly IIDCompendiumAssayDataService _IDCompendiumAssayDataService;
        public IDCompendiumDataAssayDataController(IIDCompendiumAssayDataService iDCompendiumAssayDataService)
        {
            _IDCompendiumAssayDataService = iDCompendiumAssayDataService;
        }
        [HttpPost("Save")]
        public async Task<RequestResponse> SaveIDCompendiumAssayDataAsync(SaveIDCompendiumAssayDataRequest request)
        {
            return await _IDCompendiumAssayDataService.SaveIDCompendiumAssayDataAsync(request);
        }
        [HttpPost("GetAll")]
        public async Task<DataQueryResponse<List<IDCompendiumAssayDataDetailedResponse>>> GetIDCompendiumAssayDataDetailAsync(DataQueryViewModel<IDCompendiumAssayDataQueryModel> query)
        {
            return await _IDCompendiumAssayDataService.GetIDCompendiumAssayDataDetailAsync(query);
        }
        [HttpDelete("DeleteById/{id:int}")]
        public async Task<RequestResponse> DeleteSpecimenTypeById(int id)
        {
            return await _IDCompendiumAssayDataService.DeleteIDCompendiumAssayDataByIdAsync(id);
        }
        [HttpGet("GetPanelsAndReportingRulesById/{id:int}")]
        public async Task<RequestResponse<List<PanelAndReportingRulesResponse>>> GetPanelsAndReportingRulesByIdAsync(int Id)
        {
            return await _IDCompendiumAssayDataService.GetPanelsAndReportingRulesByIdAsync(Id);
        }
        [HttpGet("ReferenceLabs/Lookup")]
        public async Task<RequestResponse<List<ReferenceLabLookup>>> ReferenceLabsLookup()
        {
            return await _IDCompendiumAssayDataService.referenceLabLookupAsync();
        }
    }
}
