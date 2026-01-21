using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Newtonsoft.Json;
using System.Net;
using System.Text.Json;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;
using TrueMed_Project_One_Service.Helpers;
using static TrueMed.RequisitionManagement.Domain.Models.Dtos.Response.RequisitionResponse;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Route("api/Requisition")]
    [Authorize]
    [HandleException]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [ApiController]
    public class RequisitionController : ControllerBase
    {
        private readonly IRequisitionService _requisitionService;
        private readonly ILookupManager _lookupManager;

        public RequisitionController(IRequisitionService requisitionService,
            ILookupManager lookupManager)
        {
            _requisitionService = requisitionService;
            _lookupManager = lookupManager;
        }
       
      
        [HttpGet("GetControlsWithValueByReqIdForEdit")]
        public ActionResult<SectionPlusControlsWithValue> GetControlsWithValueByReqIdForEdit([FromQuery] int reqId)
        {
            return _requisitionService.GetControlsWithValueByReqIdForEdit(reqId);
        }
        [HttpPost("AddNewProvider")]
        public ActionResult<RequestResponse> AddNewProvider(RequisitionRequest.AddNewProvider request)
        {
            return _requisitionService.AddNewProvider(request);
        }
        [HttpPost("SubmitRequisition")]
        public ActionResult<RequestResponse<SaveRequisitionResponse>> SubmitRequisition(SaveRequisitionRequest request)
        {
            return _requisitionService.SubmitRequisition(request);
        }
        //[HttpPost("GetRequisitionDetails")]
        //public ActionResult<DataQueryResponse<List<GetRequisitionResponse>>> GetRequisitionDetails(DataQueryModel<RequisitionQM> filter)
        //{
        //    return _requisitionService.GetRequisitionDetails(filter);
        //}
        [HttpGet("GlobalFilterTest")]
        public ActionResult<List<TrueMed.Domain.Models.Database_Sets.Application.TblFacility>> GlobalFilterTest()
        {
            return _requisitionService.GlobalFilterTest();
        }

     



    }
}
