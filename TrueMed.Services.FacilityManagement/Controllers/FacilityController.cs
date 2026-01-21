using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Business.Services.FacilityModel;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.FacilityManagement.Business.Services.Provider;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;
using TrueMed.FacilityManagement.Domain.Models.Facility.Request;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Repositories.Facility.Interface;
using TrueMed_Project_One_Service.Helpers;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Business.Services.Implementation;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;

namespace TrueMed.Services.FacilityManagement.Controllers
{
    [Route("api/Facility")]
    [ApiController]
    [Authorize]
    [HandleException]
    //[Required_X_Portal_Key(true, Order = int.MinValue)]
    public partial class FacilityController : ControllerBase
    {
        private readonly IFacilityLabManagement _facilityLabManagement;
        private readonly IFacilityManagement _facilityManagement;
        private readonly IConnectionManager _connectionManager;
        private readonly IUserManagement _userManagement;
        private readonly APIResponseViewModel _aPIResponseViewModel;
        private readonly IFacilityOptionsService _facilityOptionsService;

        public FacilityController(
            IFacilityLabManagement facilityLabManagement,
            IUserManagement userManagement,
            IFacilityManagement facilityManagement,
            IConnectionManager connectionManager,
            IFacilityOptionsService facilityOptionsService)
        {
            this._facilityLabManagement = facilityLabManagement;
            _facilityManagement = facilityManagement;
            _userManagement = userManagement;
            this._connectionManager = connectionManager;
            _aPIResponseViewModel = new APIResponseViewModel();
            _facilityOptionsService = facilityOptionsService;
        }

        [HttpPost("UpsertFacility")]
        public async Task<IActionResult> UpsertFacility(FacilityViewModel facility)
        {
            return _aPIResponseViewModel.Create(await FacilityManager.AddOrUpdateFacilityAsync(facility, _connectionManager));
        }

        [HttpPost("Facilities")]
        public IActionResult GetFacilities(DataQueryViewModel<FacilityQueryViewModel> queryViewModel)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, DataTables.GetFacilities(_facilityManagement, _userManagement, queryViewModel));
        }

        [HttpGet("GetFacilityById/{facilityId:int}")]
        public async Task<IActionResult> GetFacilityById(int facilityId)
        {
            var facility = await _facilityManagement.GetFacilityByIdAsync(facilityId);
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, facility);
        }

        [HttpGet("GetFacilityByStatus/{status}")]
        public async Task<IActionResult> GetFacilityByStatus(string status)
        {
            var facility = await _facilityManagement.GetFacilities().FirstOrDefaultAsync(x => x.GeneralInfo.FacilityStatus.Equals(status));
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, facility);
        }

        [HttpGet("GetFacilityOptions")]
        public async Task<IActionResult> GetFacilityOptions()
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, await _facilityManagement.GetFacilityOptionsAsync());
        }

        [HttpDelete("DeleteFacility/{facilityId:int}")]
        public async Task<IActionResult> DeleteFacility(int facilityId)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, await _facilityManagement.DeleteFacilityByIdAsync(facilityId, _connectionManager.UserId));
        }

        [HttpPost("FacilityStatusChange")]
        public async Task<IActionResult> FacilityStatusChange(FacilityStatusChange facilityParam)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, await _facilityManagement.FacilityStatusChangeAsync(facilityParam));
        }

        [HttpPost("AddFacilityUser")]
        public async Task<IActionResult> AddFacilityUser(FacilityUserViewModel viewModel)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, await _facilityManagement.AddUserInFacilityAsync(viewModel));
        }

        [HttpGet("ViewFacilityAssignUser/{facilityId:int}")]
        public async Task<IActionResult> ViewFacilityAssignUser(int facilityId)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, await _facilityManagement.GetFacilityAssignedUserByFacilityIdAsync(facilityId, (int)_connectionManager.GetLabId()));
        }

        [HttpGet("GetAllCollectorsByFacilityId/{facilityId:int}")]
        public async Task<IActionResult> GetAllCollectorsByFacilityId(int facilityId)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, await _facilityManagement.GetFacilityCollectorsFacilityIdAsync(facilityId, (int)_connectionManager.GetLabId()));
        }


        [HttpPost("ChangeFacilityStatusByBulk")]
        public async Task<IActionResult> ChangeFacilityStatusByBulk(ChangeFacilityStatusByBulk statusByBulk)
        {

            foreach (var item in statusByBulk.FacilityIds)
            {
                if (await _facilityManagement.IsFacilityExistsByIdAsync(item))
                {
                    await _facilityManagement.FacilityStatusChangeAsync(new FacilityStatusChange
                    {
                        FacilityId = item,
                        Status = statusByBulk.Status
                    });
                }

            }

            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, null, "request processed successfully.");
        }

        [HttpPost("Facilities/Brief")]
        public IActionResult GetFacilitiesBriefInfo(DataQueryViewModel<string> dataQueryView)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, DataTables.GetFacilitiesBriefInfo(_facilityManagement, dataQueryView));
        }
        [HttpGet("Facilities/Active")]
        public IActionResult GetAllActiveFacilities()
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, DataTables.GetAllActiveFacilities(_facilityManagement));
        }
        [HttpGet("GetFacilitiesAgainstUserId/{UserId}")]
        public async Task<RequestResponse> GetFacilitiesAgainstUserId(string UserId)
        {
            return await _facilityManagement.GetFacilityAgainstUserIdAsync(UserId);
        }

        [HttpGet("IsFacilityNameUnique/{facilityName}")]
        public async Task<RequestResponse> IsFacilityNameUnique(string facilityName)
        {
            return await _facilityManagement.IsFacilityNameUniqueAsync(facilityName);
        }

        [HttpGet("{facilityId:int}/Providers/Brief")]
        public async Task<IActionResult> GetFacilityProviders(int facilityId)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, await FacilityProviderManager.GetProvidersBriefByFacilityIdAsync(facilityId, _connectionManager));
        }

        [HttpPost("{facilityId:int}/Provider/Save")]
        public IActionResult SaveFacilityProviders(int facilityId, RequisitionFacilityProviderViewModel viewModel)
        {
            return _aPIResponseViewModel.Create(FacilityProviderManager.SaveRequisitionProviderAndAddInFacilityBrief(facilityId, viewModel, _connectionManager));
        }
        [HttpPost("FacilityFileUploads")]
        public async Task<IActionResult> FacilityFileUploads([FromForm]FacilityFileUploadRequest request)
        {
            var response = await _facilityLabManagement.FacilityFileUploads(request);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        [HttpDelete("RemoveFacilityUploads")]
        public async Task<IActionResult> RemoveFacilityUploads([FromQuery] string? id = null, [FromQuery] int facilityId = 0)
        {
            var response = await _facilityLabManagement.RemoveFacilityUploads(id,facilityId);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        #region Bulk Operations

        [HttpPost("Facility_Export_To_Excel")]
        public IActionResult FacilityExportToExcel(FacilityExportTolExcelRequest request)
        {
            var result = _facilityManagement.FacilityExportToExcel(request);
            return Ok(result);

        }
        
        [HttpPost("BulkFacilityUpload")]
        public IActionResult BulkFacilityUpload(FileDataRequest request)
        {
            var result = _facilityManagement.BulkFacilityUpload(request);
            return Ok(result);

        }
        [HttpPost("FacilityStatusChangedForApproval")]
        public ActionResult<object> FacilityStatusChangedForApproval([FromBody] FacilityStatusChangedForApprovalRequest request)
        {
            return _facilityManagement.FacilityStatusChangedForApproval(request);
        }
        #endregion
        [HttpGet("GetFileTemplates")]
        public IActionResult GetFileTemplates()
        {
            var res =  _facilityManagement.GetFileTemplates();
            return Ok(res);
        }






        

        [HttpPost("FacilityOptions/GetAll")]
        public Task<DataQueryResponse<List<FacilityOptionsResponse>>> GetAll(DataQueryModel<FacilityOptionsQueryModel> query)
        {
            return _facilityOptionsService.GetAllFacilityOptions(query);
        }
        [HttpPost("FacilityOptions/SaveFacilityOption")]
        public Task<RequestResponse> SaveLabAssignmentAsync(List<SaveFacilityOptionsRequest> request)
        {
            return _facilityOptionsService.SaveFacilityOption(request);
        }
        [HttpPost("FacilityOptions/SaveFacilities")]
        public Task<RequestResponse> SaveLabAssignmentAsync(SaveFacilities request)
        {
            return _facilityOptionsService.SaveFacilitiesAsync(request);
        }
    }
}
