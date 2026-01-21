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
    [Route("api/PatientLoginUser")]
    [Authorize]
    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [ApiController]
    public class PatientAuthManagementController : ControllerBase
    {
        private readonly IPatientLoginManagement _patientLoginManagement;

        public PatientAuthManagementController(IPatientLoginManagement patientLoginManagement)
        {
            _patientLoginManagement = patientLoginManagement;
        }
        [HttpPost("SavePatientLoginUser")]
        public async Task<RequestResponse> SavePatientLoginUser(SavePatientLoginViewModel entity)
        {
            return await _patientLoginManagement.SavePatientLoginAsync(entity).ConfigureAwait(false);
        }
        [HttpPost("GetPatientLoginDetail")]
        public async Task<DataQueryResponse<List<GetPatientLoginUserDetailViewModel>>> GetPatientLoginDetailAsync(DataQueryModel<PatientLoginUserQueryModel> query)
        {
            return await _patientLoginManagement.GetPatientLoginDetailAsync(query).ConfigureAwait(false);
        }
        [HttpPost("VerifiedPatientLoginUserPassword")]
        public async Task<RequestResponse<bool>> VerifiedPatientLoginUserPassword(PatientHashedPasswordVerifiedViewModel entity)
        {
            return await _patientLoginManagement.VerifiedPatientLoginUserPasswordAsync(entity).ConfigureAwait(false);
        }
    }
}
