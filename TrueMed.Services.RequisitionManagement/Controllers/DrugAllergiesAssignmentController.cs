using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.LookUps;
using TrueMed.Domain.Models.Response;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [ApiController]
    public class DrugAllergiesAssignmentController : ControllerBase
    {
        private readonly IDrugAllergiesAssignmentService _drugAllergiesAssignmentService;

        public DrugAllergiesAssignmentController(IDrugAllergiesAssignmentService drugAllergiesAssignmentService)
        {
            _drugAllergiesAssignmentService = drugAllergiesAssignmentService;
        }
        #region Commands
        [HttpPost("Save")]
        public ActionResult<Domain.Models.Response.RequestResponse<int>> Save(DrugAllergiesAssignmentRequest.SaveRequest request)
        {
            return _drugAllergiesAssignmentService.Save(request);
        }
        [HttpPost("StatusChanged")]
        public ActionResult<Domain.Models.Response.RequestResponse<object>> StatusChanged(DrugAllergiesAssignmentRequest.StatusChangedRequest request)
        {
            return _drugAllergiesAssignmentService.StatusChanged(request);
        }
        [HttpDelete("Delete")]
        public ActionResult<Domain.Models.Response.RequestResponse<object>> Delete([FromQuery] int id)
        {
            return _drugAllergiesAssignmentService.Delete(id);
        }
        #endregion

        #region Queries
        [HttpPost("GetAll")]
        public ActionResult<DataQueryResponse<List<DrugAllergiesAssignmentResponse.GetAllResponse>>> GetAll(DataQueryModel<DrugAllergiesAssignmentQM> query)
        {
            return _drugAllergiesAssignmentService.GetAll(query);
        }
        [HttpGet("GetById")]
        public ActionResult<TrueMed.Domain.Models.Response.RequestResponse<DrugAllergiesAssignmentResponse.GetByIdResponse>> GetById([FromQuery] int id)
        {
            return _drugAllergiesAssignmentService.GetById(id);
        }
        #endregion

        #region Lookups
        [HttpGet("Code_Lookup")]
        public async Task<List<dynamic>> DrugAllergiesCode_Lookup([FromQuery] string? description)
        {
            return await _drugAllergiesAssignmentService.DrugAllergiesCode_Lookup(description);
        }
        [HttpGet("RequisitionType_Lookup")]
        public async Task<List<CommonLookupResponse>> RequisitionType_Lookup()
        {
            return await _drugAllergiesAssignmentService.RequisitionType_Lookup();
        }
        [HttpGet("ReferenceLab_Lookup")]
        public async Task<List<CommonLookupResponse>> GetOnlyReferenceLab_Lookup()
        {
            return await _drugAllergiesAssignmentService.GetOnlyReferenceLab_Lookup();
        }
        [HttpGet("Facility_Lookup")]
        public async Task<List<FacilityLookupResponse>> Facility_Lookup()
        {
            return await _drugAllergiesAssignmentService.Facility_Lookup();
        }
        [HttpGet("Panel_Lookup")]
        public async Task<List<CommonLookupResponse>> Master_CompendiumPanel_Lookup()
        {
            return await _drugAllergiesAssignmentService.Master_CompendiumPanel_Lookup();
        }
        #endregion
    }
}
