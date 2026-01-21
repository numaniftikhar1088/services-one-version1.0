using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.Domain.Helpers;
using TrueMed.InsuranceManagement.Business.Implementations;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.Service.InsuranceManagement.Controllers
{
    [Route("api/ICD10Code")]
    [ApiController]
    [Authorize]
    public class ICD10CodeController : ControllerBase
    {
        private readonly IICD10CodeSetupService _iCD10CodeSetupService;

        public ICD10CodeController(IICD10CodeSetupService iCD10CodeSetupService)
        {
            _iCD10CodeSetupService = iCD10CodeSetupService;
        }

        [HttpGet("GetICD10CodeSetupBriefInfo")]
        public async Task<DataQueryResponse<List<GetICD10CodeSetupBriefInfoDto>>> GetICD10CodeSetupBriefInfo()
        {
            return await _iCD10CodeSetupService.GetICD10CodeSetupBriefInfoAsync().ConfigureAwait(false);
        }
        [HttpPost("GetICD10CodeDetailInfo")]
        public async Task<DataQueryResponse<List<GetICD10CodeDetailInfoDto>>> GetICD10CodeDetailInfo(DataQueryModel<ICD10CodeSetupQueryModel> query)
        {
            return await _iCD10CodeSetupService.GetICD10CodeDetailInfoAsync(query).ConfigureAwait(false);
        }
        [HttpGet("GetICD10CodeSetupBriefInfoById/{id:int}")]
        public async Task<RequestResponse<GetICD10CodeSetupBriefInfoDto>> GetICD10CodeSetupBriefInfoById(int id)
        {
            return await _iCD10CodeSetupService.GetICD10CodeSetupBriefInfoByIdAsync(id).ConfigureAwait(false);
        }
        [HttpGet("GetICD10CodeDetailInfoById/{id:int}")]
        public async Task<RequestResponse<GetICD10CodeDetailInfoDto>> GetICD10CodeDetailInfoById(int id)
        {
            return await _iCD10CodeSetupService.GetICD10CodeDetailInfoByIdAsync(id).ConfigureAwait(false);
        }
        [HttpPost("SaveICD10CodeSetup")]
        public async Task<RequestResponse> SaveICD10CodeSetup(SaveICD10CodeSetupDto entity)
        {
            return await _iCD10CodeSetupService.SaveICD10CodeSetupAsync(entity).ConfigureAwait(false);
        }
        [HttpPost("StatusChangedICD10CodeSetup")]
        public async Task<RequestResponse> StatusChangedICD10CodeSetup(StatusChangedICD10CodeSetupDto entity)
        {
            return await _iCD10CodeSetupService.StatusChangedICD10CodeSetupAsync(entity).ConfigureAwait(false);
        }
        [HttpDelete("DeleteICD10CodeSetupById/{id:int}")]
        public async Task<RequestResponse> DeleteICD10CodeSetupById(int id)
        {
            return await _iCD10CodeSetupService.DeleteICD10CodeSetupByIdAsync(id).ConfigureAwait(false);
        }
        [HttpGet("SearchICD10/{query}/{key:int}")]
        public async Task<IActionResult> SearchICDCodes(string query,int key)
        {
            var response = await _iCD10CodeSetupService.ICD10CodesSearch(query, key);
            return Ok(response);
        }
    }
}
