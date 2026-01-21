using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Busines.Interfaces;
using TrueMed.LISManagement.Business.Interfaces;
using TrueMed.LISManagement.Domain.DTOS.Request;
using TrueMed.LISManagement.Domain.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domain.DTOS.Response;
using TrueMed.LISManagement.Domains.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.Service.LISManagement.Controllers
{

    [Authorize]
    [Required_X_Portal_Key(true, Order = int.MinValue)]
    [Route("api/[controller]")]
    [ApiController]
    public class ResultFileController : ControllerBase
    {
        private readonly IResultFileService _resultFileService;
        public ResultFileController(IResultFileService resultFileService)
        {
            _resultFileService = resultFileService;
        }
        [HttpPost("FileUpload")]
        public async Task<IActionResult> FileUpload(ResultFileUploadRequest request)
        {
            var response = await _resultFileService.FileUpload(request);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        [HttpPost("GetAll")]
        public ActionResult<DataQueryResponse<List<ResultFileResponse>>> GetResultFiles(DataQueryModel<ResultFileQueryModel> query)
        {
            return _resultFileService.GetResultFiles(query);
        }
        [HttpPost("Archive")]
        public RequestResponse ExportToExcel(int[] selectedRow)
        {

            return _resultFileService.Archive(selectedRow);
        }
        [HttpGet("GetLogsById/{id:int}")]
        public IActionResult UploadFile(int id)
        {
            var response = _resultFileService.GetLogsById(id);

            if (response.StatusCode == HttpStatusCode.OK)
                return StatusCode((int)HttpStatusCode.OK, response);
            else
                return StatusCode((int)HttpStatusCode.InternalServerError);
        }
        [HttpGet("GetFileTypesLookup")]
        public async Task<List<CommonLookupResponse>> GetFileTypes_Lookup()
        {
            return await _resultFileService.GetFileTypesLookup();
        }

    }
}
