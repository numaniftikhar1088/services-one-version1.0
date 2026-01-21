
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Response;
using TrueMed.ReportingServer.Business.Services.Interfaces;
using TrueMed.ReportingServer.Domain.Dtos.Request;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed.Service.ReportingServer.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [HandleException]
   // [Required_X_Portal_Key(true, Order = int.MinValue)]
    [ApiController]
    public class IDLISReportController : ControllerBase
    {
        private readonly IIDLISReportService _service;
        private readonly IConnectionManager _connectionManager;
        public IDLISReportController(IIDLISReportService service, IConnectionManager connectionManager)
        {
            _service = service;
            _connectionManager = connectionManager;
        }
        [HttpPost("IDLISReport")]
        public async Task<ActionResult<RequestResponse<string>>> IDLISReport(IDLISReportRequest request)
        {
             return await _service.GeneratePDFReportAsync(request);
            //return Ok("Success");
        }
        [HttpPost("IDLISBulkPublishAndValidate")]
        public RequestResponse BulkPublishAndValidate(IDLISResultDataValidateRequest[] request)
        {
             return _service.BulkPublishAndValidate(request);
            //return Ok("Success");
        }
        [HttpPost("PrintReports")]
        public async Task<RequestResponse<string>> PrintReports(int[]? request)
        {
             return await _service.PrintSelectedReports(request);
            //return Ok("Success");
        }
        //[HttpGet("GeneratePDFReport")]
        //public async Task GeneratePDFReport()
        //{
        //    return await _service.GeneratePDFReportAsync();
        //}
    }
}
