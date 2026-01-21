using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrueMed.CompendiumManagement.Business.Services.Test;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.Domain.Models.Datatable;

namespace TrueMed.Services.CompendiumManagement.Controllers
{
    public partial class TestManagementController
    {
        #region test-assignment-start
        [HttpPost("Test/Assignment/Create")]
        public async Task<IActionResult> AddTestAssignment(TestAssignmentViewModel testAssignmentViewModel)
        {
            return _aPIResponseViewModel.Create(await TestAssignmentManager.SaveOrUpdateTestAssignmentByIdAsync(testAssignmentViewModel, _connectionManager));
        }

        [HttpPut("Test/Assignment/Update")]
        public async Task<IActionResult> UpdateTestAssignment(UpdateTestAssignmentViewModel testAssignmentViewModel)
        {
            return _aPIResponseViewModel.Create(await TestAssignmentManager.SaveOrUpdateTestAssignmentByIdAsync(testAssignmentViewModel, _connectionManager));
        }

        [HttpPost("IsTestAssignmentExists")]
        public async Task<IActionResult> IsTestAssignmentExists(int testAssignmentId)
        {
            return _aPIResponseViewModel.Create(await _testAssignmentManagement.IsTestAssignmentExistsByIdAsync(testAssignmentId));
        }

        [HttpPatch("Test/Assignment/{assignmentId:int}/Activation")]
        public async Task<IActionResult> TestAssignmentActivation(int assignmentId, [FromBody] bool isActive)
        {
            return _aPIResponseViewModel.Create(await _testAssignmentManagement.AssignmentActivationByIdAsync(assignmentId, isActive));
        }

        [HttpDelete("Test/Assignment/{assignmentId:int}/Delete")]
        public async Task<IActionResult> DeleteTestAssignment(int assignmentId)
        {
            return _aPIResponseViewModel.Create(await _testAssignmentManagement.DeleteAssignmentByIdAsync(assignmentId));
        }

        [HttpPost("Tests/Assignments")]
        public async Task<IActionResult> SearchTestAssignments(DataQueryViewModel<TestAssignQueryViewModel> dataQueryViewModel)
        {
            return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK, await TestAssignmentManager.SearchTestAssignmentsAsync(dataQueryViewModel, _connectionManager));
        }
        #endregion test-assignment-end
    }
}
