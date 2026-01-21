using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.Business.Interface;
using TrueMed.RequisitionManagement.Business.Services.Requisition;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Request;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Implementation;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Interface;
using TrueMed_Project_One_Service.Helpers;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Authorize]
    [HandleException]
    [ApiController]
    [Route("api/RequisitionManagement")]
    public class RequisitionManagementController : ControllerBase
    {
        private readonly IRequisitionManagement _requisitionManagement;
        APIResponseViewModel _aPIResponseViewModel;
        private IConnectionManager _connectionManager;
        private readonly ILookupManager _lookupManager;
        public RequisitionManagementController(IRequisitionManagement requisitionManagement,
            IConnectionManager connectionManager,
            ILookupManager lookupManager)
        {
            _aPIResponseViewModel = new APIResponseViewModel();
            this._requisitionManagement = requisitionManagement;
            _connectionManager = connectionManager;
            _lookupManager = lookupManager;
        }

        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpPost("RequisitionTypes")]
        public async Task<IActionResult> GetAllRequisitionTypes(DataQueryViewModel<RequisionTypeQueryViewModel> dataQueryViewModel)
        {
            return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK, await RequisitionManager.SearchRequisitionAsync(dataQueryViewModel, _connectionManager));
        }
        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpPost("RequisitionType/Create")]
        public async Task<IActionResult> AddNewType(RequisitionTypeViewModel requisitionTypeViewModel)
        {
            return _aPIResponseViewModel.Create(await RequisitionManager.AddOrUpdateTypeAsync(_connectionManager, requisitionTypeViewModel));
        }
        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpPut("RequisitionType/Update")]
        public async Task<IActionResult> UpdateType(UpdateRequisitionTypeViewModel requisitionTypeViewModel)
        {
            return _aPIResponseViewModel.Create(await RequisitionManager.AddOrUpdateTypeAsync(_connectionManager, requisitionTypeViewModel));
        }
        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpPost("IsRequisitionTypeValid")]
        public IActionResult IsTypeValid(RequisitionTypeValidation uniqueKeyValidationView)
        {
            return _aPIResponseViewModel.Create(_requisitionManagement.IsTypeValid(new KeyValuePairViewModel<int?>
            {
                Id = uniqueKeyValidationView.Id,
                KeyValue = uniqueKeyValidationView.Name
            }));
        }
        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpPost("StatusChange")]
        public IActionResult StatusChange([FromQuery]int id, [FromQuery] bool status)
        {
            var response = _requisitionManagement.RequisitionTypeStatusChanged(id, status);
            return Ok(response);
        }
        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpPatch("RequisitionType/{id:int}/Activation")]
        public async Task<IActionResult> RequisitionTypeActivation(int id, [FromBody] bool isActive)
        {
            return _aPIResponseViewModel.Create(await _requisitionManagement.RequisitionTypeActivationByIdAsync(id, isActive));
        }

        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpGet("CollectorsByFacilityId/{facilityId:int}/Lookup")]
        public async Task<IActionResult> GetCollectorLookup(int facilityId)
        {
            return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK, await RequisitionManager.GetCollectorLookupByFacilityIdAsync(facilityId, _connectionManager));
        }
      


        #region Lookup Section Start 
        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpGet("RequisitionType_Lookup")]
        public async Task<IActionResult> RequisitionType_Lookup()
        {
            var result = await _lookupManager.Master_RequisitionType_Lookup();
            return Ok(result); 
        }
        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpGet("RequisitionColor_Lookup")]
        public async Task<IActionResult> RequisitionTypeColor_Lookup()
        {
            var result = await _lookupManager.RequisitionTypeColor_Lookup();
            return Ok(result);
        }
        [Required_X_Portal_Key(true, Order = int.MinValue)]
        [HttpGet("RequisitionColorByReqTypeId_Lookup")]
        public async Task<IActionResult> RequisitionColorByReqTypeId_Lookup([FromQuery] int reqTypeId)
        {
            var result = await _lookupManager.RequisitionColorByReqTypeId_Lookup(reqTypeId);
            return Ok(result);
        }
        #endregion
    }
}
