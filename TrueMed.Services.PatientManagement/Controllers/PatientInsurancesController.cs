using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.Domain.Helpers;
using TrueMed.PatientManagement.Domain.Models.Patient.Request;
using TrueMed.PatientManagement.Domain.Models.Patient.Response;
using TrueMed.PatientManagement.Domain.QueryModel;
using TrueMed.PatientManagement.Domain.QueryModel.Base;
using TrueMed.PatientManagement.Domain.Repositories.Patient.Interface;
using TrueMed.PatientManagement.Domain.ResponseModel;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.PatientManagement.Controllers
{
    [Route("api/PatientInsurances")]
    [ApiController]
    [Authorize]
    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    public class PatientInsurancesController : ControllerBase
    {
        private readonly IPatientInsuranceService _patientInsuranceService;

        public PatientInsurancesController(IPatientInsuranceService patientInsuranceService)
        {
            _patientInsuranceService = patientInsuranceService;
        }
        [HttpPost("SavePatientInsurance")]
        public async Task<RequestResponse> SavePatientInsurance(SavePatientInsuranceViewModel entity)
        {
            return await _patientInsuranceService.SavePatientInsuranceAsync(entity).ConfigureAwait(false);
        }
        [HttpPost("GetPatientInsuranceDetails")]
        public async Task<DataQueryResponse<List<GetPatientInsuranceDetailViewModel>>> GetPatientInsuranceDetails(DataQueryModel<PatientInsuranceQueryModel> query)
        {
            return await _patientInsuranceService.GetPatientInsuranceDetailAsync(query).ConfigureAwait(false);
        }
        [HttpGet("GetPatientInsuranceDetailByPatientId/{id:int}")]
        public async Task<RequestResponse<GetPatientInsuranceDetailByPatientIdViewModel>> GetPatientInsuranceDetailByPatientId(int id)
        {
            return await _patientInsuranceService.GetPatientInsuranceDetailByPatientIdAsync(id);
        }
        [HttpGet("InsuranceTypeLookup")]
        public async Task<RequestResponse<List<InsuranceTypeLookupViewModel>>> InsuranceTypeLookup()
        {
            return await _patientInsuranceService.InsuranceTypeLookupAsync();
        }
        [HttpGet("InsuranceProviderLookup")]
        public async Task<RequestResponse<List<InsuranceProviderLookupViewModel>>> InsuranceProviderLookup()
        {
            return await _patientInsuranceService.InsuranceProviderLookupAsync();
        }
        [HttpGet("FacilityLookup")]
        public async Task<RequestResponse<List<FacilityLookupViewModel>>> FacilityLookup()
        {
            return await _patientInsuranceService.FacilityLookup();
        }
    }
}
