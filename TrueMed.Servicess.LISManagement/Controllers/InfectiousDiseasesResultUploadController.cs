using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Business.Interfaces;
using TrueMed.LISManagement.Domain.DTOS.Request;
using TrueMed.LISManagement.Domains.DTOS.Request;

namespace TrueMed.Servicess.LISManagement.Controllers
{
    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class InfectiousDiseasesResultUploadController : ControllerBase
    {
        private readonly IResultFileService _resultFileService;
        private readonly ILookupManager _lookupManager;
        public InfectiousDiseasesResultUploadController(IResultFileService resultFileService, ILookupManager lookupManager)
        {
            _resultFileService= resultFileService;
            _lookupManager = lookupManager;
        }
        [HttpPost("UploadResultFile")]
        public async Task<ActionResult<RequestResponse>> InfectiousDiseasesResultFile([FromForm] ResultFileUploadRequest request)
        {
            return await _resultFileService.FileUpload(request);
        }
        [HttpPost("UploadFile")]
        public async Task<ActionResult<RequestResponse>> FileUploadAsync([FromForm] IDResultFileUploadRequest request)
        {
            return await _resultFileService.FileUploadAsync(request);
        }
        //[HttpGet("LookUpTest")]
        //public async Task<ActionResult<List<CommonLookupResponse<string>>>> Look()
        //{
        //    return await _lookupManager.DrugAllergiesBasedOnLabAssignment();
        //}
    }
}
