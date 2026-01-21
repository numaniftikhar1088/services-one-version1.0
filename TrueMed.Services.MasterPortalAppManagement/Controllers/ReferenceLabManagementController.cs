using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Models.Datatable;
using TrueMed.MasterPortalAppManagement.Business.Services.Lab;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Request;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Lab;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    public partial class LabManagementController
    {
        [HttpPost]
        [Route("ReferenceLabs/Brief")]
        public IActionResult GetReferenceLabsBreifInfo(DataQueryViewModel<string> queryModel)
        {
            return Ok(LabManager.GetReferenceLabsBrief(queryModel, _labManagement));
        }

        [HttpPost("AssignReferenceLabToPrimaryLab")]
        public async Task<IActionResult> ReferenceLabAssignment(ReferenceLabAssignmentViewModel assignmentViewModel)
        {
            var result = await _labAssignmentManagement.AddReferenceLabInPrimaryLabByIdAsync(assignmentViewModel);
            return _aPIResponseViewModel.Create(result);
        }

        [HttpPost("GetReferenceLabAssignments")]
        public async Task<IActionResult> GetReferenceLabsAssignementByLabId([FromBody] DataQueryViewModel<ReferenceLabAssignmentQueryViewModel> dataQuery)
        {
            var referenceLabsAssignments = await LabAssignmentManager.GetReferenceLabsAssignmentsAsync(_connectionManager, dataQuery);
            return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK, referenceLabsAssignments);
        }

    }
}
