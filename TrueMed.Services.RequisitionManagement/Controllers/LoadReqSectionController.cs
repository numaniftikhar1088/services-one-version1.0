using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Net;
using TrueMed.Domain.Helpers;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Services.RequisitionManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    public class LoadReqSectionController : ControllerBase
    {
        private readonly IRequisitionLoadService _requisitionLoadService;

        public LoadReqSectionController(IRequisitionLoadService requisitionLoadService)
        {
            _requisitionLoadService = requisitionLoadService;
        }
        [HttpPost("ByFailityIDandInsuranceId")]
        public IActionResult GetRequisitionByFacilityIdAndInsuranceID(LoadReqSectionRequest request)
        {
            var result = _requisitionLoadService.GetRequisitionSection(request);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }

        [HttpPost("LoadCommonSectionForRequisition")]
        public IActionResult LoadCommonSectionForRequisition(LoadCommonRequisitionRequest request)
        {
            var result = _requisitionLoadService.LoadCommonSectionForRequisition(request);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }

        [HttpGet("ViewRequisitionOrder")]
        public IActionResult ViewRequisitionOrder(int RequisitionId)
        {
            var result = _requisitionLoadService.ViewRequisitionOrder(RequisitionId);
            if (result != null)
            {
                return Ok(result);
            }
            return StatusCode((int)HttpStatusCode.InternalServerError);
        }


    }
}
