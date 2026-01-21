using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.ExternalConnectors;
using System.Net;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Business.Interface;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.MasterPortalAppManagement.Business.Services.Lab;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Implementations;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Interfaces;
using TrueMed.MasterPortalServices.BusinessLayer.Models.Lab;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public partial class LabManagementController : ControllerBase
    {
        private readonly IUserManagement _userManagement;
        private readonly ILabManagement _labManagement;
        private readonly APIResponseViewModel _aPIResponseViewModel;
        private IConfiguration _configuration;
        private readonly IConnectionManager _connectionManager;
        private readonly ILabAssignmentManagement _labAssignmentManagement;
        private readonly ILookupManager _lookupManager;
        private readonly ILabManagementService_v2 _labManagementService_V2;

        public LabManagementController(IUserManagement userManagement,
            ILabManagement labManagement, IConfiguration configuration,
            IConnectionManager connectionManager, ILabAssignmentManagement labAssignmentManagement,
            ILabManagementService_v2 labManagementService_V2,
            ILookupManager lookupManager
            )
        {
            this._userManagement = userManagement;
            this._labManagement = labManagement;
            this._labAssignmentManagement = labAssignmentManagement;
            _aPIResponseViewModel = new APIResponseViewModel();
            _configuration = configuration;
            _connectionManager = connectionManager;
            _lookupManager = lookupManager;
            _labManagementService_V2 = labManagementService_V2;
        }

        [HttpPost]
        [Route("Lab/Create")]
        public async Task<IActionResult> CreateLab(LabViewModel labViewModel)
        {
            var labIdetityResult = await LabManager.CreateLabAsync(labViewModel, _connectionManager);
            if (labIdetityResult.IsSuccess)
            {
                return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, labIdetityResult);
            }
            else
            {
                return _aPIResponseViewModel.Create(Request, HttpStatusCode.BadRequest, labIdetityResult);
            }
        }

        [HttpPost]
        [Route("Lab/{labId:int}/AssociateUsers")]
        public IActionResult AssociateUsers(int labId, [FromBody] string[] userIds)
        {
            var labIdetityResult = _labManagement.AssociateUsersInLab(labId, userIds);
            return _aPIResponseViewModel.Create(labIdetityResult.IsSuccess ? HttpStatusCode.OK : HttpStatusCode.BadRequest, labIdetityResult);
        }

        [HttpPost]
        [Route("Lab/Update")]
        public IActionResult UpdateLab(UpdateLabViewModel labViewModel)
        {
            var labIdetityResult = LabManager.UpdateLab(labViewModel, _connectionManager);
            return _aPIResponseViewModel.Create(labIdetityResult);
        }

        [HttpPost]
        [Route("Labs/Brief")]
        public IActionResult GetLabsBreifInfo(DataQueryViewModel<string> queryModel)
        {
            return Ok(LabManager.GetLabsBrief(queryModel, _labManagement));
        }

        [HttpDelete]
        [Route("Lab/{labId}/Delete")]
        public IActionResult DeleteLab(int labId)
        {
            var isExistLab = _labManagement.IsLabExistsById(labId);
            if (!isExistLab)
                return _aPIResponseViewModel.Create(Request, HttpStatusCode.BadRequest, "lab not found");

            _labManagement.DeleteLabById(labId);

            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, "lab deleted successfully");

        }

        [HttpGet]
        [Route("Lab/{labId}")]
        public IActionResult GetLabById(int labId)
        {
            var lab = _labManagement.GetAllLabs().FirstOrDefault(x => x.Id == labId);
            if (lab == null)
                return _aPIResponseViewModel.Create(Request, HttpStatusCode.BadRequest, null, "lab not found");

            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, lab, "lab found");

        }

        [HttpPost]
        [Route("Labs")]
        public IActionResult GetLabs(DataQueryViewModel<LabQueryViewModel> dataTableQueryViewModel)
        {
            return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK, LabManager.GetLabs(dataTableQueryViewModel, _labManagement));
        }
        [HttpPut]
        [Route("Lab/{labId:int}/Activation")]
        public async Task<IActionResult> LabActivation(int labId, [FromBody] bool isActive)
        {
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, await _labManagement.LabActivationAsync(labId, isActive));
        }

        [HttpGet("GetReferenceLabAssignment")]
        public ActionResult<DataQueryResponse<List<LabManagementRespone_v2.GetReferenceLabAssignmentResponse>>> GetReferenceLabAssignment(DataQueryModel<LabManagementQueryModel.GetReferenceLabAssignmentQM> query)
        {
            return _labManagementService_V2.GetReferenceLabAssignment(query);
        }
        [HttpPost("ReferenceLabAssignmentStatusChanged")]
        public ActionResult<RequestResponse> ReferenceAssignmentStatusChanged(LabManagementRequest_v2.StatusChangedRequest request)
        {
            return _labManagementService_V2.ReferenceAssignmentStatusChanged(request);
        }
        [HttpGet("LoggedUserAssignLabs")]
        public async Task<ActionResult<List<CommonLookupResponse>>> LoggedUserAssignLabs()
        {
            return await _lookupManager.LoggedUserAssignLabs();
        }

    }
}
