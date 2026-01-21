using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Response;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed_Project_One_Service.Helpers;
using RequestResponse = TrueMed.Domain.Models.Response.RequestResponse;

namespace TrueMed.Sevices.MasterPortalAppManagement.Controllers
{
    [Required_X_Portal_Key(Order = int.MinValue)]
    [HandleException]
    [Authorize]
    [Route("api/LabManagement")]
    [ApiController]
    public class Lab_ReferenceLabManagementController : ControllerBase
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ILab_ReferenceLabService _lab_ReferenceLabService;
        public Lab_ReferenceLabManagementController(IConnectionManager connectionManager, ILab_ReferenceLabService lab_ReferenceLabService)
        {
            _connectionManager = connectionManager;
            _lab_ReferenceLabService = lab_ReferenceLabService;
        }
        #region Commands
        [HttpPost("Save")]
        public RequestResponse Save(ReferenceLabRequest request)
        {
            return _lab_ReferenceLabService.Save(request);
        }
        [HttpDelete("Delete")]
        public RequestResponse Delete([FromQuery] int id)
        {
            return _lab_ReferenceLabService.Delete(id);
        }
        [HttpPost("StatusChanged")]
        public RequestResponse StatusChanged([FromQuery] int id, bool status)
        {
            return _lab_ReferenceLabService.StatusChanged(id, status);
        }
        #endregion
        #region Queries
        [HttpPost("GetAll")]
        public ActionResult<DataQueryResponse<List<GetAllReferenceLabResponse>>> GetAll(DataQueryModel<ReferenceLabQueryModel> query)
        {
            return _lab_ReferenceLabService.GetAll(query);
        }
        [HttpGet("GetById")]
        public ActionResult<Domain.Models.Response.RequestResponse<GetByIdReferenceLabResponse>> GetById([FromQuery] int id)
        {
            return _lab_ReferenceLabService.GetById(id);
        }
        #endregion
    }
}
