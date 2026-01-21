using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.LookupModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TestsSetupController : ControllerBase
    {
        private readonly ITestSetupService _testSetupService;
        public TestsSetupController(ITestSetupService testSetupService)
        {
            _testSetupService = testSetupService;
        }
        [HttpPost("SaveTestSetup")]
        public async Task<RequestResponse> SaveTestSetup(SaveTestSetupRequest request)
        {
            return await _testSetupService.SaveTestSetupAsync(request);
        }
        [HttpPost("GetTestSetupDetail")]
        public async Task<DataQueryResponse<List<GetTestSetupDetailResponse>>> GetTestSetupDetailAsync(DataQueryModel<TestSetupQueryModel> query)
        {
            return await _testSetupService.GetTestSetupDetailAsync(query);
        }
        [HttpGet("GetTestSetupDetailById/{id:int}")]
        public async Task<RequestResponse<GetTestSetupDetailByIdResponse>> GetTestSetupDetailByIdAsync(int id)
        {
            return await _testSetupService.GetTestSetupDetailByIdAsync(id);
        }
        [HttpPost("ChangeTestSetupStatus")]
        public async Task<RequestResponse> ChangeTestSetupStatus(ChangeTestSetupStatusRequest request)
        {
            return await _testSetupService.ChangeTestSetupStatusAsync(request);
        }
        [HttpDelete("DeleteTestSetupById/{id:int}")]
        public async Task<RequestResponse> DeleteTestSetupById(int id)
        {
            return await _testSetupService.DeleteTestSetupByIdAsync(id);
        }

        [HttpGet("TestSetupLookup")]
        public async Task<RequestResponse<List<TestSetupLookup>>> PanelSetupLookup()
        {
            return await _testSetupService.TestSetupLookupAsync();
        }

    }
}
