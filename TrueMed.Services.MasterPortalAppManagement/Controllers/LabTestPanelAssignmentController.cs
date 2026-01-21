using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LabTestPanelAssignmentController : ControllerBase
    {
        private readonly ILabTestPanelAssignmentService _labTestPanelAssignmentService;

        public LabTestPanelAssignmentController(ILabTestPanelAssignmentService labTestPanelAssignmentService)
        {
            _labTestPanelAssignmentService = labTestPanelAssignmentService;
        }
        #region Queries
        [HttpGet("GetById")]
        public IActionResult GetById([FromQuery] int id)
        {
            var response = _labTestPanelAssignmentService.GetById(id);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        [HttpPost("GetAll")]
        public IActionResult GetAll(DataQueryModel<LabTestPanelAssignmentQueryModel> query) 
        {
            var response = _labTestPanelAssignmentService.GetAll(query);

            if (response != null)
                return StatusCode((int)HttpStatusCode.OK,response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        #endregion
        #region Commands
        [HttpPost("Save")]
        public IActionResult Save(LabTestPanelAssignmentSaveRequest request) 
        {
            var response = _labTestPanelAssignmentService.Save(request);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        [HttpDelete("DeleteById")]
        public IActionResult DeleteById([FromQuery] int id)
        {
            var response = _labTestPanelAssignmentService.DeleteById(id);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        #endregion

    }
}
