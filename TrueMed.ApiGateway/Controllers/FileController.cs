using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using System.Net;
using System.Reflection.Metadata;
using System.Text.RegularExpressions;
using TrueMed.ApiGateway.Model;
using TrueMed.Domain.Helpers;
using static System.Reflection.Metadata.BlobBuilder;

namespace TrueMed.ApiGateway.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly APIResponseViewModel _aPIResponseViewModel;
        [HttpGet]
        public string Get()
        {


            return "My test action";
        }
        public FileController(IConfiguration configuration)
        {
            _configuration = configuration;
            _aPIResponseViewModel = new APIResponseViewModel();
        }

        [Route("UploadBlob")]
        [HttpPost]
        public async Task<IActionResult> UploadBlob(BlobModel model)
        {

            BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);


            var containerName = $"{model.PortalKey}-{model.Extention.Replace(".", "")}".ToLower();

            BlobContainerClient containerClient = blobService.GetBlobContainerClient(containerName);


            await containerClient.CreateIfNotExistsAsync();

            model.Name = Regex.Replace(model.Name, @"(\s+|@|&|'|\(|\)|<|>|#)", "");
            var blobName = string.IsNullOrEmpty(model.Name) ? $"File-{DateTime.UtcNow.Ticks}.{model.Extention.Replace(".", "")}" : $"{Path.GetFileNameWithoutExtension(model.Name)}-{DateTime.UtcNow.Ticks}.{model.Extention.Replace(".", "")}";

            BlobClient blob = containerClient.GetBlobClient(blobName);

            await blob.UploadAsync(BinaryData.FromBytes(model.Content));

            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, blob.Uri.ToString());

        }


        [Route("UploadResultsToBlob")]
        [HttpPost]
        public async Task<IActionResult> UploadResultsToBlob([FromForm] IFormFile file)
        {

            BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);
            var portalkey = Request.Headers["X-Portal-Key"];

            Console.WriteLine("Portal Key: "+portalkey);
            Console.WriteLine("file: " + file);
            Console.WriteLine("FileName: "+ file.FileName);


            var containerName = $"{portalkey}-files".ToLower();

            if (!string.IsNullOrEmpty(Path.GetExtension(file.FileName)))
                containerName= $"{portalkey}-{Path.GetExtension(file.FileName)}".ToLower();

            BlobContainerClient containerClient = blobService.GetBlobContainerClient(containerName.Replace(".",""));




            await containerClient.CreateIfNotExistsAsync();
          


            var blobName = string.IsNullOrEmpty(file.FileName) ? $"File-{DateTime.UtcNow.Ticks}" : $"{Path.GetFileNameWithoutExtension(file.FileName)}-{DateTime.UtcNow.Ticks}{Path.GetExtension(file.FileName)}";
            blobName = blobName.Replace("/", "");
            BlobClient blob = containerClient.GetBlobClient(blobName);



            BlobHttpHeaders httpHeaders = new BlobHttpHeaders()
            {
                ContentType = file.ContentType,
                ContentDisposition = file.ContentDisposition.ToLower().Replace("form-data", "inline"),


            };
            IDictionary<string, string> metadata = new Dictionary<string, string>();
            metadata.Add("docType", Path.GetExtension(file.FileName).Replace(".", ""));


            using (var stream = file.OpenReadStream())
            {
                await blob.UploadAsync(stream, httpHeaders,metadata);
            }
         //   await blob.UploadAsync(BinaryData.FromBytes(file.CopyTo));

            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, blob.Uri.ToString());

        }

        [Route("UploadMultiFilesToBlob")]
        [HttpPost]
        public async Task<IActionResult> UploadFilesToBlob([FromForm] List<IFormFile> files)
        {
            var blobUrilst = new List<string>();
            BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);
            var portalkey = Request.Headers["X-Portal-Key"];

            Console.WriteLine("Portal Key: " + portalkey);


            foreach (var file in files)
            {


                Console.WriteLine("FileName: " + file.FileName);


                var containerName = $"{portalkey}-files".ToLower();

                if (!string.IsNullOrEmpty(Path.GetExtension(file.FileName)))
                    containerName = $"{portalkey}-{Path.GetExtension(file.FileName).Replace(".","")}".ToLower();

                BlobContainerClient containerClient = blobService.GetBlobContainerClient(containerName.Replace(".", ""));


                await containerClient.CreateIfNotExistsAsync();
          


                var blobName = string.IsNullOrEmpty(file.Name) ? $"File-{DateTime.UtcNow.Ticks}" : $"{Path.GetFileNameWithoutExtension(file.Name)}-{DateTime.UtcNow.Ticks}{Path.GetExtension(file.Name)}";

                BlobClient blob = containerClient.GetBlobClient(blobName);
                BlobHttpHeaders httpHeaders = new BlobHttpHeaders()
                {
                    ContentType = file.ContentType,
                    ContentDisposition= file.ContentDisposition.ToLower().Replace("form-data", "inline"),
                    
                    
                };
                
                using (var stream = file.OpenReadStream())
                {
                    await blob.UploadAsync(stream, httpHeaders);
                }
                //   await blob.UploadAsync(BinaryData.FromBytes(file.CopyTo));
                blobUrilst.Add(blob.Uri.ToString());
            }
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, blobUrilst);

        }

        [Route("UploadResultsToBlobbAsync")]
        [HttpPost]
        public async Task<IActionResult> UploadResultsToBlobAsync(IFormFile file)
        {

            BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);
            var portalkey = Request.Headers["X-Portal-Key"];

            Console.WriteLine("Portal Key: " + portalkey);
            Console.WriteLine("FileName: " + file.FileName);


            var containerName = $"{portalkey}-files".ToLower();

            if (!string.IsNullOrEmpty(Path.GetExtension(file.FileName)))
                containerName = $"{portalkey}-{Path.GetExtension(file.FileName)}".ToLower();

            BlobContainerClient containerClient = blobService.GetBlobContainerClient(containerName.Replace(".", ""));


            await containerClient.CreateIfNotExistsAsync();
            Guid g = Guid.NewGuid();
            string GuidString = Convert.ToBase64String(g.ToByteArray());
            GuidString = GuidString.Replace("=", "");
            GuidString = GuidString.Replace("+", "");



            var blobName = string.IsNullOrEmpty(file.FileName) ? $"{GuidString}-{DateTime.UtcNow.Ticks}" : $"{file.Name}-{GuidString}-{DateTime.UtcNow.Ticks}{Path.GetExtension(file.FileName)}";

            BlobClient blob = containerClient.GetBlobClient(blobName);
            using (var stream = file.OpenReadStream())
            {
                await blob.UploadAsync(stream);
            }
            //   await blob.UploadAsync(BinaryData.FromBytes(file.CopyTo));

            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, blob.Uri.ToString());

        }

        [Route("UploadFilesToBlobAsync")]
        [HttpPost]
        public async Task<IActionResult> UploadFilesToBlobAsync(List<IFormFile> files)
        {
            var blobUrilst = new List<string>();
            BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);
            var portalkey = Request.Headers["X-Portal-Key"];

            Console.WriteLine("Portal Key: " + portalkey);


            foreach (var file in files)
            {


                Console.WriteLine("FileName: " + file.FileName);


                var containerName = $"{portalkey}-files".ToLower();

                if (!string.IsNullOrEmpty(Path.GetExtension(file.FileName)))
                    containerName = $"{portalkey}-{Path.GetExtension(file.FileName)}".ToLower();

                BlobContainerClient containerClient = blobService.GetBlobContainerClient(containerName.Replace(".", ""));


                await containerClient.CreateIfNotExistsAsync();
                Guid g = Guid.NewGuid();
                string GuidString = Convert.ToBase64String(g.ToByteArray());
                GuidString = GuidString.Replace("=", "");
                GuidString = GuidString.Replace("+", "");



                var blobName = string.IsNullOrEmpty(file.FileName) ? $"{GuidString}-{DateTime.UtcNow.Ticks}" : $"{file.Name}-{GuidString}-{DateTime.UtcNow.Ticks}{Path.GetExtension(file.FileName)}";

                BlobClient blob = containerClient.GetBlobClient(blobName);
                using (var stream = file.OpenReadStream())
                {
                    await blob.UploadAsync(stream);
                }
                //   await blob.UploadAsync(BinaryData.FromBytes(file.CopyTo));
                blobUrilst.Add(blob.Uri.ToString());
            }
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, blobUrilst);

        }


        [Route("UploadFilesToBlobFormModel")]
        [HttpPost]
        public async Task<IActionResult> UploadFiles(List<BlobModel> models)
        {
            var blobUrilst= new List<string>();

            foreach (var model in models)
            {


                BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);

                
                var containerName = $"{model.PortalKey}-{model.Extention.Replace(".", "")}".ToLower();

                BlobContainerClient containerClient = blobService.GetBlobContainerClient(containerName);


                await containerClient.CreateIfNotExistsAsync();
                Guid g = Guid.NewGuid();
                string GuidString = Convert.ToBase64String(g.ToByteArray());
                GuidString = Regex.Replace(GuidString, @"(\s+|@|&|'|\(|\)|<|>|#|=)", "");
                GuidString = GuidString.Replace("+", "");
                //GuidString = GuidString.Replace("/", "");


                model.Name = Regex.Replace(model.Name, @"(\s+|@|&|'|\(|\)|<|>|#|=)", "");
                var blobName = string.IsNullOrEmpty(model.Name) ? $"{GuidString}-{DateTime.UtcNow.Ticks}.{model.Extention.Replace(".", "")}" : $"{Path.GetFileNameWithoutExtension(model.Name)}-{GuidString}-{DateTime.UtcNow.Ticks}.{model.Extention.Replace(".", "")}";

                BlobClient blob = containerClient.GetBlobClient(blobName);
           
                await blob.UploadAsync(BinaryData.FromBytes(model.Content));
                //BlobSasBuilder sasBuilder = new BlobSasBuilder()
                //{
                //    BlobContainerName = blob.GetParentBlobContainerClient().Name,
                //    BlobName = blob.Name,
                //    Resource = "b"
                //};
                //sasBuilder.ExpiresOn = DateTimeOffset.UtcNow.AddSeconds(120);
                //sasBuilder.SetPermissions(BlobSasPermissions.Read);
                //var sasUri = blob.GenerateSasUri(sasBuilder);
                blobUrilst.Add(blob.Uri.ToString());
            }
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, blobUrilst);

        }


        [Route("DownloadBlob")]
        [HttpPost]
        public async Task<IActionResult> DownloadFileFromBlobStorageAsync(BlobDownloadModel model)
        {
            string base64String = string.Empty;
            var exten = string.Empty;
            var fileName = string.Empty;

            if (!string.IsNullOrEmpty(model.Path))
            {
                var splitedBlobPath = model.Path.Split('/');
                var container = splitedBlobPath[3];
                var blobName =  splitedBlobPath[4];
                exten = Path.GetExtension(blobName);
                fileName = Path.GetFileNameWithoutExtension(blobName);

                BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);

                // Get a reference to the container
                var containerClient = blobService.GetBlobContainerClient(container);

                // Get a reference to the blob
                var blobClient = containerClient.GetBlobClient(blobName);

                // Download the blob content as a byte array
                var memoryStream = new MemoryStream();
                await blobClient.DownloadToAsync(memoryStream);
                byte[] contentBytes = memoryStream.ToArray();

                // Convert the byte array to base64 string
                base64String = Convert.ToBase64String(contentBytes);


            }
            return Ok(new  {
                Content = base64String,
                Extension = exten,
                FileName = fileName
            });
        }

        [Route("UploadLogo")]
        [HttpPost]
         public async Task<IActionResult> UploadLogoBlob(BlobModel model)
        {



            BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);


            var containerName = $"tmpologos".ToLower();

            BlobContainerClient containerClient = blobService.GetBlobContainerClient(containerName);


            await containerClient.CreateIfNotExistsAsync();
            Guid g = Guid.NewGuid();
            string GuidString = Convert.ToBase64String(g.ToByteArray());
            GuidString = GuidString.Replace("=", "");
            GuidString = GuidString.Replace("+", "");



            var blobName = string.IsNullOrEmpty(model.Name) ? $"{GuidString}-{DateTime.UtcNow.Ticks}.{model.Extention.Replace(".", "")}" : $"{model.Name}-{GuidString}-{DateTime.UtcNow.Ticks}.{model.Extention.Replace(".", "")}";

            BlobClient blob = containerClient.GetBlobClient(blobName);


            await blob.UploadAsync(BinaryData.FromBytes(model.Content));

            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, blob.Uri.ToString());

        }

        [Route("ShowBlob")]
        [HttpPost]
        public IActionResult ShowBlob(string uri)
        {


            var blobName = uri.Split('/')[uri.Split('/').Length - 1];
            var containerName = uri.Split('/')[uri.Split('/').Length - 2];



            BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);


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

        [Route("ShowBlobInViewer")]
        [HttpPost]
        public IActionResult ShowBlobInViewer(string uri)
        {

            var docsViewerlst= new List<DocsViewerResponse>();

            var blobName = uri.Split('/')[uri.Split('/').Length - 1];
            var containerName = uri.Split('/')[uri.Split('/').Length - 2];



            BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);


            BlobContainerClient containerClient = blobService.GetBlobContainerClient(containerName);

         
            BlobClient blobClient = containerClient.GetBlobClient(blobName);
            BlobProperties properties =  blobClient.GetPropertiesAsync().GetAwaiter().GetResult();

            var FileType = properties.Metadata.FirstOrDefault(x => x.Key == "docType").Value??"";


            BlobSasBuilder sasBuilder = new BlobSasBuilder()
            {
                BlobContainerName = blobClient.GetParentBlobContainerClient().Name,
                BlobName = blobClient.Name,
                Resource = "b"
            };
            sasBuilder.ExpiresOn = DateTimeOffset.UtcNow.AddSeconds(15);
            sasBuilder.SetPermissions(BlobSasPermissions.Read);
            var docs = new DocsViewerResponse();
            docs.uri = blobClient.GenerateSasUri(sasBuilder).ToString();
            docs.fileType = FileType;
            docsViewerlst.Add(docs);
            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, docsViewerlst);

        }

        [Route("ShowBlobs")]
        [HttpPost]
        public IActionResult ShowBlobs(List<string> uris)
        {
            var sasUris = new List<string>();

            foreach (var uri in uris)
            {

                var blobName = uri.Split('/')[uri.Split('/').Length - 1];
                var containerName = uri.Split('/')[uri.Split('/').Length - 2];



                BlobServiceClient blobService = new BlobServiceClient(_configuration["AzureStorageConnectionStrings"]);


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
            }


            return _aPIResponseViewModel.Create(Request, HttpStatusCode.OK, sasUris);

        }







    }
}
