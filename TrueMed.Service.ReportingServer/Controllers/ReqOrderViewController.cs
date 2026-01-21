using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using TrueMed.Business.FiltersAndHanldlers;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Response;
using TrueMed.ReportingServer.Business.Services.Interfaces;
using TrueMed.ReportingServer.Domain.Dtos.Request;

namespace TrueMed.Service.ReportingServer.Controllers
{
    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class ReqOrderViewController : ControllerBase
    {
        private readonly IReqOrderViewService _service;
        public ReqOrderViewController(IReqOrderViewService service)
        {
            _service = service;
        }
        [HttpGet("GetReqOrderViewPdf/{reqId:int}")]
        public async Task<ActionResult<RequestResponse<string>>> GetReqOrderViewPdf(int reqId)
        {
            return await _service.GetReqOrderViewPdf(reqId);
            //return Ok("Success");
        }

        [HttpPost("PrintRecords")]
        public async Task<RequestResponse<string>> PrintReports(int[] reqIds)
        {
             return await _service.GetReqOrderRecords(reqIds);
            //return Ok("Success");
        }
    }
}
