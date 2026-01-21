using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed_Project_One_Service.Helpers;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TrueMed.Services.FacilityManagement.Controllers
{
    [Required_X_Portal_Key(Order = int.MaxValue)]
    [HandleException]
    [Route("api/[controller]")]
    [ApiController]
    public class LabAssignmentController : ControllerBase
    {
        private readonly ILabAssignmentService _service;

        public LabAssignmentController(ILabAssignmentService service)
        {
            _service = service;
        }
        [HttpPost("GetAll")]
        public Task<DataQueryResponse<List<LabAssignmentResponse>>> GetAll(DataQueryModel<LabAssignmentQueryModel> query)
        {
            return _service.GetLabAssignmentDetailAsync(query);
        }
        [HttpDelete("DeleteById/{id:int}")]
        public async Task<RequestResponse> DeleteById(int id)
        {
            return await _service.DeleteByIdAsync(id);
        }
        [HttpPost("SaveLabAssignment")]
        public Task<RequestResponse> SaveLabAssignmentAsync(AddLabAssignmentRequest request)
        {
            return _service.SaveLabAssignmentAsync(request);
        }
        [HttpGet("ReferenceLab_Lookup")]
        public Task<RequestResponse<List<ReferenceLabLookupDto>>> ReferenceLabLookupAsync()
        {
            return _service.ReferenceLabLookupAsync();
        }
        [HttpGet("RequisitionTypesByLabId_Lookup/{id:int}")]
        public Task<List<CommonLookupResponse>> GetRequisitionTypesByLabId(int id)
        {
            return _service.GetRequisitionTypesByLabId(id);
        }
        [HttpGet("GroupsByRequisitionType_Lookup/{id:int}")]
        public Task<List<CommonLookupResponse>> GetGroupsByRequisitionType(int id)
        {
            return _service.GetGroupsByRequisitionType(id);
        }
        [HttpGet("InsuranceTypes_Lookup")]
        public Task<List<CommonLookupResponse>> GetInsuranceTypes()
        {
            return _service.GetInsuranceTypes();
        }
        [HttpGet("Gender_Lookup")]
        public Task<List<CommonLookupResponse>> GetGender()
        {
            return _service.GetGender();
        }
        [HttpPost("SaveFacilities")]
        public Task<RequestResponse> SaveFacilitiesAsync(SaveFacilities request)
        {
            return _service.SaveFacilitiesAsync(request);
        }
        [HttpGet("GetFacilitiesLookup")]
        public async Task<List<CommonLookupResponse>> GetFacilitiesLookup()
        {
            return await _service.GetFacilitiesLookup();
        }
    }
}
