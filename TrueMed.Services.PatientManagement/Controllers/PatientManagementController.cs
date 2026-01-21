using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps;
using TrueMed.Domain.Models.Request;
using TrueMed.Domain.Models.Response;
using TrueMed.PatientManagement.Business.Services.Interfaces;
using TrueMed.PatientManagement.Domain.Models.Dtos.Request;
using TrueMed.PatientManagement.Domain.Models.Dtos.Response;
using TrueMed.PatientManagement.Domain.Models.QueryModels.Request;
using TrueMed.PatientManagement.Domain.Models.QueryModels.Response;
using TrueMed.PatientManagement.Domain.Models.Response.Request.Base;
using TrueMed.PatientManagement.Domain.Models.Response.Response.Base;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.PatientManagement.Controllers
{

    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientManagementController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly ILookupManager _lookupManager;
        private readonly IBlobStorageManager _blobStorageManager;

        public PatientManagementController(IPatientService patientService, ILookupManager lookupManager, IBlobStorageManager blobStorageManager)
        {
            _patientService = patientService;
            _lookupManager = lookupManager;
            _blobStorageManager = blobStorageManager;
        }
        #region Commands
        [HttpPost("Save")]
        public RequestResponse Save(SavePatientRequest request)
        {
            return _patientService.Save(request);
        }
        [HttpDelete("Delete")]
        public RequestResponse Delete(int id)
        {
            return _patientService.Delete(id);
        }
        #endregion
        #region Queries
        [HttpPost("GetAll")]
        public DataQueryResponse<List<PatientResponseQM>> GetAll(DataQueryRequest<PatientRequestQM> query)
        {
            return _patientService.GetAll(query);
        }
        [HttpGet("GetById")]
        public RequestResponse<PatientByIdResponse> GetById([FromQuery] int id)
        {
            return _patientService.GetById(id);
        }
        [HttpPost("GetPatientByFacilityId")]
        public DataQueryResponse<List<PatientResponseByFNameLnameAndDateOfBirthQM>> GetPatientByFNameLNameAndDateOfBirthAndFacilityId(PatientByFNameLnameAndDateOfBirthQM query)
        {
            return _patientService.GetPatientByFNameLNameAndDateOfBirthAndFacilityId(query); 
        }
        [HttpPost("GetPatientByFNameLNameWithInsuranceDetail")]
        public async Task<RequestResponse<List<GetPatientsByFNameLNameResponse>>> GetPatientByFNameLNameWithInsuranceDetail(PatientSearchByFNameLNameRequest request)
        {
            return await _patientService.GetPatientByFNameLNameWithInsuranceDetailAsync(request);
        }
        #endregion

        #region Lookups
        [HttpGet("Facility_Lookup")]
        public async Task<ActionResult<List<FacilityLookupResponse>>> Facility_Lookup()
        {
            return await _lookupManager.Facility_Lookup();
        }
        #endregion


        //[HttpPost("blobtest")]
        //public async Task<ActionResult<BlobStorageResponse>> BlobTest(BlobRequest blobRequest)
        //{
        //    return await _blobStorageManager.UploadBase64Async(blobRequest);
        //}
    }
}
