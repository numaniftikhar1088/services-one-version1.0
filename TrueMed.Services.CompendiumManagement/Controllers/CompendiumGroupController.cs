using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.CompendiumManagement.Business.Services.Test;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Models.Test.Response;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Implementation;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed_Project_One_Service.Helpers;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [HandleException]
    [Route("api/CompendiumGroup")]
    [ApiController]
    [Authorize]
    public class CompendiumGroupController : ControllerBase
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IPanelGroupManagement _panelGroupManagement;
        private readonly IPanelManagement _panelManagement;
        private readonly IPanelTypeManagement _panelTypeManagement;
        private readonly ITestAssignmentManagement _testAssignmentManagement;
        private readonly ITestManagement _testManagement;
        APIResponseViewModel _aPIResponseViewModel;
        public CompendiumGroupController(
            IConnectionManager connectionManager,
            IPanelGroupManagement panelGroupManagement,
            IPanelManagement panelManagement,
            IPanelTypeManagement panelTypeManagement,
            ITestAssignmentManagement testAssignmentManagement,
            ITestManagement testManagement
            )
        {
            this._connectionManager = connectionManager;
            this._panelGroupManagement = panelGroupManagement;
            this._panelManagement = panelManagement;
            this._panelTypeManagement = panelTypeManagement;
            this._testAssignmentManagement = testAssignmentManagement;
            this._testManagement = testManagement;
            _aPIResponseViewModel = new APIResponseViewModel();
        }

        [HttpPost("GetDetails")]
        public async Task<DataQueryResponse<List<PanelGroupViewModelResp>>> GetPanelSetupDetail(DataQueryViewModel<PanelGroupQueryViewModel> dataQueryViewModel)
        {
            return await _panelGroupManagement.SearchCompendiumGroupAsync(dataQueryViewModel);
        }
        //[HttpPost("PanelGroups")]
        //public async Task<IActionResult> SearchGroup(DataQueryViewModel<PanelGroupQueryViewModel> dataQueryViewModel)
        //{
        //    return _aPIResponseViewModel.Create(Request,
        //        System.Net.HttpStatusCode.OK, await PanelGroupManager.SearchPanelGroupAsync(dataQueryViewModel, _connectionManager));
        //}

        [HttpPost("Create")]
        public async Task<IActionResult> CreatePanelGroup(PanelGroupViewModel groupPanelSetupView)
        {

            return _aPIResponseViewModel.Create(await PanelGroupManager.SaveOrUpdatePanelGroupAsync(groupPanelSetupView, _connectionManager));
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdatePanelGroup(UpdatePanelGroupViewModel groupPanelSetupView)
        {

            return _aPIResponseViewModel.Create(await PanelGroupManager.SaveOrUpdatePanelGroupAsync(groupPanelSetupView, _connectionManager));
        }

        [HttpPost("IsGroupNameValid")]
        public async Task<IActionResult> IsPanelGroupNameValid(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {

            return _aPIResponseViewModel.Create(await _panelGroupManagement.IsPanelGroupNameValidAsync(uniqueKeyValidation));
        }

        [HttpDelete("{id:int}/Delete")]
        public async Task<IActionResult> DeletePanelGroup(int id)
        {
            return _aPIResponseViewModel.Create(await _panelGroupManagement.DeletePanelGroupByIdAsync(id));

        }

        [HttpPost("Activation")]
        public async Task<IActionResult> PanelGroupActivationV2(PanelGroupStatusChangeRequest panelGroupStatusChangeRequest)
        {
            return _aPIResponseViewModel.Create(await _panelGroupManagement.PanelGroupActivationByIdAsync(panelGroupStatusChangeRequest.Id, Convert.ToBoolean(panelGroupStatusChangeRequest.IsActive)));
        }
        //[HttpPatch("{id:int}/Activation")]
        //public async Task<IActionResult> PanelGroupActivation(int id, [FromBody] bool isActive)
        //{
        //    return _aPIResponseViewModel.Create(await _panelGroupManagement.PanelGroupActivationByIdAsync(id, isActive));
        //}

        [HttpGet("Lookup")]
        public async Task<IActionResult> Lookup()
        {

            return _aPIResponseViewModel.Create(Request,
                System.Net.HttpStatusCode.OK, await PanelGroupManager.GetCompendiumGroupLookupAsync(_connectionManager));
        }
    }
}
