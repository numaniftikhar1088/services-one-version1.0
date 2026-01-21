using Microsoft.AspNetCore.Mvc;
using TrueMed.CompendiumManagement.Business.Services.Blood_Compendium;
using TrueMed.CompendiumManagement.Domain.Models.Blood_Compendium.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Blood_Compendium.Implementation;
using TrueMed.CompendiumManagement.Domain.Repositories.Blood_Compendium.Interfaces;
using TrueMed.Domain.Helpers;
using TrueMed.Business.Interface;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    [Required_X_Portal_Key(Order = int.MaxValue)]
    [HandleException]
    [Route("api/TestSetupManagement")]
    [ApiController]
    public class TestSetupManagementController : ControllerBase
    {
        private readonly ITestSetupManagement _testSetupManagement;
        private readonly IConnectionManager _connectionManager;
        private readonly APIResponseViewModel _aPIResponseViewModel;
        public TestSetupManagementController(ITestSetupManagement testSetupManagement, IConnectionManager connectionManager)
        {
            this._testSetupManagement = testSetupManagement;
            this._connectionManager = connectionManager;
            _aPIResponseViewModel = new APIResponseViewModel();
        }

        [HttpPut("UpdateIndividualTestSetup")]
        public async Task<IActionResult> UpdateIndividualTestSetup(UpdateIndividualSetupViewModel updateIndividualSetup)
        {
            return _aPIResponseViewModel.Create(await TestSetupManager.SaveOrUpdateIndividualTestSetupAsync(updateIndividualSetup, _connectionManager));
        }
    }
}
