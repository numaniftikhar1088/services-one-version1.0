using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.CompendiumManagement.Business.Services.Test;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed_Project_One_Service.Helpers;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Required_X_Portal_Key(Order = int.MaxValue)]
    [HandleException]
    [Route("api/TestManagement")]
    [ApiController]
    public partial class TestManagementController : ControllerBase
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IPanelGroupManagement _panelGroupManagement;
        private readonly IPanelManagement _panelManagement;
        private readonly IPanelTypeManagement _panelTypeManagement;
        private readonly ITestAssignmentManagement _testAssignmentManagement;
        private readonly ITestManagement _testManagement;
        APIResponseViewModel _aPIResponseViewModel;
        public TestManagementController(
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

        
        #region panel-type-section-start
        [HttpPost("PanelTypes")]
        public async Task<IActionResult> SearchPanelTypes(DataQueryViewModel<PanelTypeQueryViewModel> dataQueryViewModel)
        {
            return _aPIResponseViewModel.Create(Request,
                System.Net.HttpStatusCode.OK, await PanelTypeManager.SearchPanelTypeAsync(dataQueryViewModel, _connectionManager));
        }

        [HttpPost("PanelType/Create")]
        public async Task<IActionResult> CreatePanelType(PanelTypeViewModel panelSetupView)
        {
            return _aPIResponseViewModel.Create(await PanelTypeManager.SaveOrUpdatePanelTypeAsync(panelSetupView, _connectionManager));
        }

        [HttpPut("PanelType/Update")]
        public async Task<IActionResult> UpdatePanelType(UpdatePanelTypeViewModel panelSetupView)
        {
            return _aPIResponseViewModel.Create(await PanelTypeManager.SaveOrUpdatePanelTypeAsync(panelSetupView, _connectionManager));
        }

        [HttpPost("IsPanelTypeNameValid")]
        public async Task<IActionResult> IsPanelTypeNameValid(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {
            return _aPIResponseViewModel.Create(await _panelTypeManagement.IsPanelTypeNameValidAsync(uniqueKeyValidation));
        }

        [HttpDelete("PanelType/{id:int}/Delete")]
        public async Task<IActionResult> DeletePanelType(int id)
        {
            return _aPIResponseViewModel.Create(await _panelTypeManagement.DeletePanelTypeByIdAsync(id));
        }

        [HttpPatch("PanelType/{id:int}/Activation")]
        public async Task<IActionResult> PanelTypeActivation(int id, [FromBody] bool isActive)
        {
            return _aPIResponseViewModel.Create(await _panelTypeManagement.PanelTypeActivationByIdAsync(id, isActive));
        }
        #endregion panel-type-section-end

        #region test-section-start
        [HttpPost("Tests")]
        public async Task<IActionResult> SearchTests(DataQueryViewModel<TestQueryViewModel> dataQueryViewModel)
        {
            return _aPIResponseViewModel.Create(Request,
                System.Net.HttpStatusCode.OK, await TestManager.SearchTestAsync(dataQueryViewModel, _connectionManager));
        }

        [HttpPost("Test/Create")]
        public async Task<IActionResult> CreateTest(TestViewModel testViewModel)
        {
            return _aPIResponseViewModel.Create(await TestManager.SaveOrUpdateTestAsync(testViewModel, _connectionManager));
        }

        [HttpPut("Test/Update")]
        public async Task<IActionResult> UpdateTest(UpdateTestViewModel testViewModel)
        {
            return _aPIResponseViewModel.Create(await TestManager.SaveOrUpdateTestAsync(testViewModel, _connectionManager));
        }

        [HttpPost("IsTestNameValid")]
        public async Task<IActionResult> IsTestNameValid(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {
            return _aPIResponseViewModel.Create(await _testManagement.IsTestNameValidAsync(uniqueKeyValidation));
        }

        [HttpDelete("Test/{id:int}/Delete")]
        public async Task<IActionResult> DeleteTest(int id)
        {
            return _aPIResponseViewModel.Create(await _testManagement.DeleteTestByIdAsync(id));
        }

        [HttpPatch("Test/{id:int}/Activation")]
        public async Task<IActionResult> TestActivation(int id, [FromBody] bool isActive)
        {
            return _aPIResponseViewModel.Create(await _testManagement.TestActiviationByIdAsync(id, isActive));
        }
        #endregion test-section-end

    }
}
