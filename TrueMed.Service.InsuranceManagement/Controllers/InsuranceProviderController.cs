using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrueMed.InsuranceManagement.Business.Implementations;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.Dtos;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.QueryModel;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Graph;
using TrueMed.Domain.Helpers;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.Service.InsuranceManagement.Controllers
{
    [Route("api/InsuranceProvider")]
    [ApiController]
    [Authorize]
    public class InsuranceProviderController : ControllerBase
    {
        private readonly IInsuranceProviderService _insuranceProviderService;

        public InsuranceProviderController(IInsuranceProviderService insuranceProviderService)
        {
            _insuranceProviderService = insuranceProviderService;
        }
        [HttpPost("SaveInsuranceProvider")]
        public async Task<RequestResponse> SaveInsuranceProvider(SaveInsuranceProviderDto saveInsuranceProviderDto)
        {
            return await _insuranceProviderService.SaveInsuranceProviderAsync(saveInsuranceProviderDto);
        }
        [HttpPost("StatusChange")]
        public async Task<RequestResponse> InsuranceSetupStatusChange(InsuranceProviderChangeStatusDto changeStatusDto)
        {
            return await _insuranceProviderService.ChangeInsuranceProviderStatusAsync(changeStatusDto);
        }
        //[HttpPost("GetInsuranceProvider")]
        //public async Task<DataQueryResponse<IQueryable>> GetInsuranceProvider(DataQueryModel<InsuranceProviderQueryModel> dataQueryModel)
        //{
        //    return await _insuranceProviderService.GetInsuranceProviderAsync(dataQueryModel);
        //}
        [HttpGet("GetInsuranceProviderById/{id:int}")]
        public async Task<RequestResponse<GetInsuranceProviderDetailByidDto>> GetInsuranceProviderById(int id)
        {
            return await _insuranceProviderService.GetInsuranceProviderByIdAsync(id);
        }
        [HttpDelete("DeleteInsuranceProvider/{id:int}")]
        public async Task<RequestResponse> DeleteInsuranceAssignmentByIdAsync(int id)
        {
            return await _insuranceProviderService.DeleteInsuranceProviderByIdAsync(id);
        }
        [HttpGet("GetProviderLookup")]
        public async Task<RequestResponse<List<InuranceProviderLookupDto>>> GetProviderLookup()
        {
            return await _insuranceProviderService.GetProviderLookupAsync();
        }
        [HttpGet("GetProviderCodeAgainstProviderId/{providerId:int}")]
        public async Task<RequestResponse<string>> GetProviderCodeAgainstProviderId(int providerId)
        {
            return await _insuranceProviderService.GetProviderCodeAgainstProviderIdAsync(providerId).ConfigureAwait(false);
        }
        [HttpPost("GetInsuranceProviderDetail")]
        public async Task<DataQueryResponse<List<GetInsuranceProviderDetailDto>>> GetInsuranceProviderDetailAsync(DataQueryModel<InsuranceProviderQueryModel> query)
        {
            return await _insuranceProviderService.GetInsuranceProviderDetailAsync(query);
        }
    }
}
