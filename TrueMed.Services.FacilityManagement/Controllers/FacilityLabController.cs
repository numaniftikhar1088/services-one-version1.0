using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Datatable;
using TrueMed.FacilityManagement.Business.FacilityModel;
using TrueMed.FacilityManagement.Domain.Models.Facility.Request;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.FacilityManagement.Controllers
{
   
    public partial class FacilityController 
    {
        /// <summary>
        /// Assign reference lab to facility 
        /// </summary>
        /// <attentionNeed>validate reqTypeId, please implement validation (might be in sprint 4)</attentionNeed>
        /// <param name="assignmentViewModel"></param>
        /// <returns></returns>
        //[HttpPost("AssignReferenceLabToFacility")]
        //public async Task<IActionResult> ReferenceLabAssignment(FacilityReferenceLabAssignmentViewModel assignmentViewModel)
        //{
        //    var result = await _facilityLabManagement.AddReferenceLabInFacilityByIdAsync(assignmentViewModel);
        //    return _aPIResponseViewModel.Create(result);
        //}

        //[HttpDelete("Facilities/{facilityId:int}/ReferenceLabAssignment/{refLabId}/Delete")]
        //public async Task<IActionResult> DeleteFacilityReferenceLabAssignment(int facilityId, int refLabId)
        //{
        //    var result = await _facilityLabManagement.DeleteReferenceLabAssignmentAsync(facilityId, refLabId);
        //    return _aPIResponseViewModel.Create(result);
        //}

        //[HttpPost("GetReferenceLabAssignments")]
        //public async Task<IActionResult> GetReferenceLabsAssignementByLabId([FromBody] DataQueryViewModel<FacilityReferenceLabAssignmentQueryViewModel> dataQuery)
        //{
        //    var referenceLabsAssignments = await FacilityLabAssignmentManager.GetReferenceLabsAssignmentsAsync(_connectionManager, dataQuery);
        //    return _aPIResponseViewModel.Create(Request, System.Net.HttpStatusCode.OK, referenceLabsAssignments);
        //}

    }
}
