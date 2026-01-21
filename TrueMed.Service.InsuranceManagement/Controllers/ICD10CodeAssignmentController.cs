using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.Dtos;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.Service.InsuranceManagement.Controllers
{
    [Route("api/ICD10CodeAssignment")]
    [ApiController]
    [Authorize]
    public class ICD10CodeAssignmentController : ControllerBase
    {
        private readonly IICD10CodeAssignmentService _iCD10CodeAssignmentService;
        private readonly ILookupManager _lookupManager;

        public ICD10CodeAssignmentController(IICD10CodeAssignmentService iCD10CodeAssignmentService, ILookupManager lookupManager)
        {
            _iCD10CodeAssignmentService = iCD10CodeAssignmentService;
            _lookupManager = lookupManager;
        }
        [HttpPost("SaveICD10CodeAssignment")]
        public async Task<RequestResponse> SaveICD10CodeAssignmentAsync(SaveICD10CodeAssignmentDto entity)
        {
            return await _iCD10CodeAssignmentService.SaveICD10CodeAssignmentAsync(entity);
        }

        [HttpPost("GetICD10CodeAssignment")]
        public async Task<DataQueryResponse<List<GetICD10CodeAssignmentDetailDto>>> GetICD10CodeAssignmentAsync(DataQueryModel<ICD10CodeAssignmentQueryModel> query)
        {
            return await _iCD10CodeAssignmentService.GetICD10CodeAssignmentAsync(query);
        }
        [HttpGet("GetICD10CodeAssignmentById/{id:int}")]
        public async Task<RequestResponse<GetICD10CodeAssignmentByIdDto>> GetICD10CodeAssignmentById(int id)
        {
            return await _iCD10CodeAssignmentService.GetICD10CodeAssignmentByIdAsync(id);
        }
        [HttpDelete("DeleteICD10CodeAssignment/{id:int}")]
        public async Task<RequestResponse> DeleteICD10CodeAssignment(int id)
        {
            return await _iCD10CodeAssignmentService.DeleteICD10CodeAssignmentAsync(id);
        }
        [HttpGet("ICD10CodeLookup/{icd10codeid:int}")]
        public async Task<RequestResponse<List<ICD10CodeLookupDto>>> ICD10CodeLookup(int icd10codeid)
        {
            return await _iCD10CodeAssignmentService.ICD10CodeLookupAsync(icd10codeid);
        }
        [HttpGet("ReferenceLabLookup")]
        public async Task<RequestResponse<List<ReferenceLabLookupDto>>> ReferenceLabLookup()
        {
            return await _iCD10CodeAssignmentService.ReferenceLabLookupAsync();
        }
        [HttpGet("FacilityLookup")]
        public async Task<RequestResponse<List<FacilityLookupDto>>> FacilityLookup()
        {
            return await _iCD10CodeAssignmentService.FacilityLookupAsync();   
        }
        [HttpGet("RequsitionTypeLookup")]
        public async Task<RequestResponse<List<RequsitionTypeLookupDto>>> RequsitionTypeLookup()
        {
            return await _iCD10CodeAssignmentService.RequsitionTypeLookupAsync(); 
        }
        [HttpGet("GetLabTypeAgainstReferenceLabId/{refLabId:int}")]
        public async Task<RequestResponse<string>> GetLabTypeAgainstReferenceLabId(int refLabId)
        {
            return await _iCD10CodeAssignmentService.GetLabTypeAgainstReferenceLabIdAsync(refLabId);
        }
        [HttpPost("ICD10CodeAssignmentStatusChanged")]
        public async Task<RequestResponse> ICD10CodeAssignmentStatusChanged(ChangeICD10CodeAssignmentStatusDto entity)
        {
            return await _iCD10CodeAssignmentService.ICD10CodeAssignmentStatusChangedAsync(entity);
        }





        #region Lookups Section
        [HttpGet("LookupForICD10Code")]
        public async Task<List<CommonLookupResponse>> LookupForICD10Code()
        {
            return await _lookupManager.ICD10CodeLookup();
        }
        [HttpGet("CompendiumPanel_Lookup")]
        public async Task<List<CommonLookupResponse>> CompendiumPanel_Lookup()
        {
            return await _lookupManager.CompendiumPanel_Lookup();
        }
        #endregion
    }
}
