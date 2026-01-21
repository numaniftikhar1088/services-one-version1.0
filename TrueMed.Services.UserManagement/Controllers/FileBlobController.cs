using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TrueMed.Domain.Helpers;
using TrueMed.Business.Interface;
using TrueMed_Project_One_Service.Helpers;

namespace TrueMed_Project_One_Service.Controllers
{
    [Authorize]
    [HandleException]
    [ApiController]
    [Route("api/Blob")]
    public class FileBlobController : ControllerBase
    {
        private readonly APIResponseViewModel _aPIResponseViewModel;
        private readonly IFileManagement _fileManagement;
        private readonly IConfiguration _configuration;

        public FileBlobController(IFileManagement fileManagement, IConfiguration configuration)
        {
            _aPIResponseViewModel = new APIResponseViewModel();
            this._fileManagement = fileManagement;
            this._configuration = configuration;
        }

        [HttpPost]
        [Route("Upload/{name?}")]
        public async Task<IActionResult> UploadFile(string? name = null)
        {
            var file = Request.Form.Files[0];
            if (file == null)
            {
                return _aPIResponseViewModel.Create(Request, HttpStatusCode.BadRequest, null, "Invalid request");
            }
            var savedFilePath = await _fileManagement.UploadFileAsync(file, name);
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, savedFilePath);
        }

        [HttpDelete]
        [Route("File/{name}/Delete")]
        public async Task<IActionResult> DeleteFile(string name)
        {
            var isDeleted = await _fileManagement.DeleteFileOnBlobIfExistsAsync(name);
            return _aPIResponseViewModel.Create(isDeleted);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("DownloadFile")]
        public async Task<IActionResult?> GetFileAsync(string fileId)
        {
            var file = await _fileManagement.GetFileAsync(fileId);
            if (file != null)
            {
                return File(file.Content, "application/octet-stream", fileDownloadName: file.Details.Metadata["FileName"]);
            }
            return null;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("OpenFile")]
        public async Task<IActionResult> OpenFileAsync(string fileId)
        {
            var file = await _fileManagement.GetFileAsync(fileId);
            if (file != null)
            {
                return new FileStreamResult(file.Content, file.Details.ContentType);
            }
            return null;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("File/{name}")]
        public async Task<IActionResult> GetFileByNameAsync(string name)
        {
            return await OpenFileAsync(name);
        }

    }
}
