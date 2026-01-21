using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Helpers;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.FacilityManagement.Controllers
{

    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class FacilityOptionsController : ControllerBase
    {
        private readonly IFacilityOptionsService _facilityOptionsService;

        public FacilityOptionsController(IFacilityOptionsService facilityOptionsService)
        {

            _facilityOptionsService = facilityOptionsService;
        }
        [HttpPost("GetAll")]
        public Task<DataQueryResponse<List<FacilityOptionsResponse>>> GetAll(DataQueryModel<FacilityOptionsQueryModel> query)
        {
            return _facilityOptionsService.GetAllFacilityOptions(query);
        }
        [HttpPost("SaveFacilityOption")]
        public Task<RequestResponse> SaveLabAssignmentAsync(List<SaveFacilityOptionsRequest> request)
        {
            return _facilityOptionsService.SaveFacilityOption(request);
        }
        [HttpPost("SaveFacilities")]
        public Task<RequestResponse> SaveLabAssignmentAsync(SaveFacilities request)
        {
            return _facilityOptionsService.SaveFacilitiesAsync(request);
        }
    }
}