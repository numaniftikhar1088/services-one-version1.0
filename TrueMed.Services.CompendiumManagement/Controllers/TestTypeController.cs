using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Helpers;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Authorize]
    public class TestTypeController : ControllerBase
    {
        private readonly ITestTypeService _testTypeService;

        public TestTypeController(ITestTypeService testTypeService)
        {
            _testTypeService = testTypeService;
        }
        [HttpPost("SaveTestType")]
        public async Task<RequestResponse> SaveTestTypeAsync(SaveTestTypeRequest request)
        {
            return await _testTypeService.SaveTestTypeAsync(request);
        }
        [HttpPost("ChangeTestTypeStatus")]
        public async Task<RequestResponse> ChangeTestTypeStatus(ChangeTestTypeStatusRequest request)
        {
            return await _testTypeService.ChangeTestTypeStatusAsync(request);
        }
        [HttpDelete("DeleteTestTypeById/{id:int}")]
        public async Task<RequestResponse> DeleteTestTypeById(int id)
        {
            return await _testTypeService.DeleteTestTypeByIdAsync(id);
        }
        [HttpPost("GetTestTypeDetail")]
        public async Task<DataQueryResponse<List<TestTypeResponse>>> GetTestTypeDetail(DataQueryModel<TestTypeQueryModel> query)
        {
            return await _testTypeService.GetTestTypeDetailAsync(query);
        }

        #region Lookups
        [HttpGet("TestTypeLookup")]
        public async Task<List<TestTypeLookup>> TestTypeLookup()
        {
            return await _testTypeService.TestTypeLookupAsync();
        }
        #endregion
    }
}
