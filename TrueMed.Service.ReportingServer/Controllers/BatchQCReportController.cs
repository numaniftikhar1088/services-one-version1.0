using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using TrueMed.Business.FiltersAndHanldlers;
using TrueMed.Domain.Models.Response;
using TrueMed.ReportingServer.Business.Services.Interfaces;

namespace TrueMed.Service.ReportingServer.Controllers
{
    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class BatchQCReportController : ControllerBase
    {
        private readonly IBatchQCReportService _service;
        public BatchQCReportController(IBatchQCReportService service)
        {
            _service = service;
        }
        [HttpGet("GetReportAsync/{id:int}")]
        public async Task<ActionResult<RequestResponse<string>>> GenerateIDBatchQCReportAsync(int id)
        {
            return await _service.GenerateIDBatchQCReportAsync(id);
            //return Ok("Success");
        }
    }
}
