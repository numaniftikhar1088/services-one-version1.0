using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;

namespace TrueMed.Services.FacilityManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignRefLabAndGroupController : ControllerBase
    {
        private readonly IAssignRefLabAndGroupService _assignRefLabAndGroupService;
        public AssignRefLabAndGroupController(IAssignRefLabAndGroupService assignRefLabAndGroupService)
        {
            _assignRefLabAndGroupService = assignRefLabAndGroupService;
        }
        #region Commands
        [HttpPost("Add")]
        public IActionResult Add(AddAssignRefLabAndGroupRequest request)
        {
            var response = _assignRefLabAndGroupService.Add(request);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        [HttpPatch("Edit")]
        public IActionResult Edit(EditAssignRefLabAndGroupRequest request)
        {
            var response = _assignRefLabAndGroupService.Edit(request);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        [HttpDelete("Delete")]
        public IActionResult Delete([FromQuery] int id)
        {
            var response = _assignRefLabAndGroupService.DeleteById(id);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        [HttpPatch("StatusChanged")]
        public IActionResult StatusChanged(StatusChangedAssignRefLabAndGroupRequest request)
        {
            var response = _assignRefLabAndGroupService.StatusChanged(request);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        #endregion
        #region Queries
        //[HttpPost("GetAll")]
        //public IActionResult GetAll([FromBody] DataQueryModel<AssignReferenceLabAndGroupQueryModel> query)
        //{
        //    var response = _assignRefLabAndGroupService.GetAll(query);

        //    if (response.StatusCode == HttpStatusCode.OK)
        //        return StatusCode((int)HttpStatusCode.OK, response);
        //    else
        //        return StatusCode((int)HttpStatusCode.InternalServerError);
        //}
        [HttpGet("GetById")]
        public async Task<IActionResult> GetById([FromQuery] int id)
        {
            var response = await _assignRefLabAndGroupService.GetById(id);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        #endregion
        #region Lookups
        [HttpGet("ReferenceLab_Lookup")]
        public async Task<List<dynamic>> ReferenceLab_Lookup([FromQuery] int labId)
        {
            return await _assignRefLabAndGroupService.ReferenceLab_Lookup(labId);
        }
        [HttpGet("RequisitionType_Lookup")]
        public async Task<List<CommonLookupResponse>> RequisitionType_Lookup()
        {
            return await _assignRefLabAndGroupService.RequisitionType_Lookup();
        }
        [HttpGet("TestGroup_Lookup")]
        public async Task<List<CommonLookupResponse>> TestGroup_Lookup()
        {
            return await _assignRefLabAndGroupService.TestGroup_Lookup();
        }
        #endregion
    }
}
