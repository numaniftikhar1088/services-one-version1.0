using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using TrueMed.Domain.Helpers;
using TrueMed.UserManagement.Domain.Repositories.File.Interface;

namespace TrueMed.Services.UserManagement.Controllers
{
    [Required_X_Portal_Key]
    [Route("api/Template")]
    [ApiController]
    public class FileTemplateManagementController : ControllerBase
    {
        public FileTemplateManagementController(IFileTemplateManagement fileManagement, 
            IConfiguration configuration)
        {
            _fileManagement = fileManagement;
            this._configuration = configuration;
            _aPIResponseViewModel = new APIResponseViewModel();
        }

        IFileTemplateManagement _fileManagement;
        private readonly IConfiguration _configuration;
        private readonly APIResponseViewModel _aPIResponseViewModel;

        
        [AllowAnonymous]
        [HttpGet("{templateName}/Download")]
        public async Task<IActionResult> DownloadTemplateByName(string templateName)
        {
            var fileUri = await _fileManagement.GetFileTemplateUriByNameAsync(templateName);
            if (string.IsNullOrWhiteSpace(fileUri))
                return _aPIResponseViewModel.Create(Request, HttpStatusCode.BadRequest, null, "Invalid template key name.");

            var blobName = fileUri?.Split('/')[fileUri.Split('/').Length - 1];
            var containerName = fileUri?.Split('/')[fileUri.Split('/').Length - 2];

            BlobServiceClient blobService = new BlobServiceClient(_configuration["ConnectionStrings:AzureConnectionStringNew"]);
            BlobContainerClient containerClient = blobService.GetBlobContainerClient(containerName);

            BlobClient blobClient = containerClient.GetBlobClient(blobName);
            BlobSasBuilder sasBuilder = new BlobSasBuilder()
            {
                BlobContainerName = blobClient.GetParentBlobContainerClient().Name,
                BlobName = blobClient.Name,
                Resource = "b"
            };
            sasBuilder.ExpiresOn = DateTimeOffset.UtcNow.AddSeconds(15);
            sasBuilder.SetPermissions(BlobSasPermissions.Read);
            var sasUri = blobClient.GenerateSasUri(sasBuilder);
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, sasUri.ToString());
        }
    }
}
