using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class TestLookupsController : ControllerBase
    {
        private readonly ITestLookupsService _testLookupsService;
        public TestLookupsController(ITestLookupsService testLookupsService)
        {
            _testLookupsService = testLookupsService;
        }
        [HttpGet("DependencyAndReflexTestLookup/{performingLabId:int}")]
        public async Task<RequestResponse<List<DependencyAndReflexTest>>> Lookup(int performingLabId)
        {
            return await _testLookupsService.DependencyAndReflexTestLookupAsync(performingLabId);
        }
    }
}
