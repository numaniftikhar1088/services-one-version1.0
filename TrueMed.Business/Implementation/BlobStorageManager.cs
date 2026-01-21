using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;

using System;
using System.ComponentModel;
using System.IO;
using System.Net;
using System.Net.Http.Headers;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Request;
using TrueMed.Domain.Models.Response;
using static Microsoft.Graph.Constants;

namespace TrueMed.Business.Implementation
{
    public class BlobStorageManager : IBlobStorageManager
    {
  
        private IConfiguration _configuration;
        private BlobServiceClient _blobService;
        public BlobStorageManager(IConfiguration configuration)
        {
            _configuration = configuration;
            _blobService = new BlobServiceClient(ConfigurationKeys.BlobStorage.BLOB_CONNECTION_STRING);
            
       
        }
        public async Task<BlobStorageResponse> UploadAsync(string containerName, string fileName, IFormFile file)
        {
            var response = new BlobStorageResponse();

   

            BlobContainerClient container = _blobService.GetBlobContainerClient(containerName);
            await container.CreateIfNotExistsAsync();
            BlobClient blob = container.GetBlobClient(fileName);

            BlobHttpHeaders httpHeaders = new BlobHttpHeaders()
            {
                ContentType = file.ContentType,
                ContentDisposition = file.ContentDisposition.ToLower().Replace("form-data", "inline"),
            };
            IDictionary<string, string> metadata = new Dictionary<string, string>();         
            metadata.Add("docType", Path.GetExtension(file.FileName).Replace(".", ""));
          

            using (var stream = file.OpenReadStream())
            {
                await blob.UploadAsync(stream, httpHeaders, metadata);
            }
            if (blob.Uri != null)
            {
                response.uri = blob.Uri.ToString();
                response.fileType = Path.GetExtension(file.FileName).Replace(".", "");
            }
            else
            {
                response.uri = string.Empty;
                response.fileType = "";
            }
            return response;
        }
        public async Task<BlobStorageResponse> UploadAsync(IFormFile file,IConnectionManager _connectionManager,string fileName="")
        {
            var response = new BlobStorageResponse();
            var portalkey = _connectionManager.X_Portal_Key_Value;




            var containerName = $"{portalkey}-files".ToLower();

            if (!string.IsNullOrEmpty(Path.GetExtension(file.FileName)))
                containerName = $"{portalkey}-{Path.GetExtension(file.FileName).Replace(".", "")}".ToLower();
            if(string.IsNullOrEmpty(fileName))
             fileName = $"File_{DateTime.UtcNow.Ticks}_{file.FileName}";
            else
                fileName = $"{Path.GetFileNameWithoutExtension(fileName)}_{DateTime.UtcNow.Ticks}_{Path.GetExtension(file.FileName)}";




            response = await UploadAsync(containerName, fileName, file);


            return response;
        }
        //public async Task<BlobStorageResponse> UploadBase64Async(BlobRequest blobRequest)
        //{
        //    var response = new BlobStorageResponse();

        //    //var containerName = $"{blobRequest.PortalKey}-{blobRequest.Extention.Replace(".", "")}".ToLower();
        //    //CloudBlobContainer container = _blobClient.GetContainerReference(containerName);
        //    //await container.CreateIfNotExistsAsync();

        //    //Guid g = Guid.NewGuid();
        //    //string GuidString = Convert.ToBase64String(g.ToByteArray());
        //    //GuidString = GuidString.Replace("=", "");
        //    //GuidString = GuidString.Replace("+", "");

        //    //var blobName = string.IsNullOrEmpty(blobRequest.Name) ? $"{GuidString}-{DateTime.UtcNow.Ticks}.{blobRequest.Extention.Replace(".", "")}" : $"{blobRequest.Name}-{GuidString}-{DateTime.UtcNow.Ticks}.{blobRequest.Extention.Replace(".", "")}";
        //    //CloudBlockBlob blob = container.GetBlockBlobReference(blobName);

        //    //await blob.UploadTextAsync(Convert.ToBase64String(blobRequest.Content));
        //    //if (blob.Uri != null)
        //    //{
        //    //    response.FilePath = blob.Uri.ToString();
        //    //    response.IsUpload = true;
        //    //}
        //    return response;
        //}
        public Task DeleteAsync(string containerName, string fileName)
        {
            throw new NotImplementedException();
        }

        public async Task<Stream> DownloadAsync(string uri)
        {
            MemoryStream stream = new MemoryStream();
            if (string.IsNullOrEmpty(uri))
                return stream;


            var blobName = uri.Split('/')[uri.Split('/').Length - 1];
            var containerName = uri.Split('/')[uri.Split('/').Length - 2];

            BlobContainerClient container = _blobService.GetBlobContainerClient(containerName);
            //  await container.CreateIfNotExistsAsync();
            BlobClient blob = container.GetBlobClient(blobName);

            await blob.DownloadToAsync(stream);


            stream.Seek(0, SeekOrigin.Begin);
            return stream;
        }


        public async Task<string> FromAzureToBase64(string azureUri)
        {
            if (string.IsNullOrEmpty(azureUri))
                return "";
              string azureBase64 = "";
            try
            {

                var blobName = azureUri.Split('/')[azureUri.Split('/').Length - 1];
                var containerName = azureUri.Split('/')[azureUri.Split('/').Length - 2];

                //  await container.CreateIfNotExistsAsync();
                BlobContainerClient container = _blobService.GetBlobContainerClient(containerName);
                BlobClient blob = container.GetBlobClient(blobName);

                using (MemoryStream stream = new MemoryStream())
                {
                    await blob.DownloadToAsync(stream);
                    var bytes = stream.ToArray();
                    azureBase64 = Convert.ToBase64String(bytes);
                }
            }
            catch (Exception ex)
            {

              
            }

            return azureBase64;

        }
       
        public async Task<string> UploadBase64ToAzureAsync(string base64String, string docName,IConnectionManager _connectionManager)
        {



            string fileName = docName;
            string cleanString = base64String.Split(',').Length > 1 ? base64String.Split(',')[1] : base64String;
            var fileExtention = GetFileExtensionFromBase64String(cleanString);

            var portalkey = _connectionManager.X_Portal_Key_Value;
            var containerName = $"{portalkey}-files".ToLower();

            if (!string.IsNullOrEmpty(fileExtention))
                containerName = $"{portalkey}-{fileExtention}".ToLower();
            if (string.IsNullOrEmpty(fileName))
                fileName = $"File_{DateTime.UtcNow.Ticks}_{fileName}";
            else
                fileName = $"{Path.GetFileNameWithoutExtension(fileName)}_{DateTime.UtcNow.Ticks}.{fileExtention}";


            byte[] bytes = Convert.FromBase64String(cleanString);

            var contentType = GetMimeTypeForFileExtension(fileName);
        

            BlobContainerClient container = _blobService.GetBlobContainerClient(containerName);
            await container.CreateIfNotExistsAsync();
            BlobClient blob = container.GetBlobClient(fileName);

            BlobHttpHeaders httpHeaders = new BlobHttpHeaders()
            {
                ContentType = contentType,
                ContentDisposition = "",
            };
            IDictionary<string, string> metadata = new Dictionary<string, string>();
            metadata.Add("docType", fileExtention);


            using(MemoryStream stream = new MemoryStream(bytes))
            {
                await blob.UploadAsync(stream, httpHeaders, metadata);
            }



            return blob?.Uri.ToString() ?? string.Empty;


        }
        public async Task<BlobStorageResponse> UploadDirectBase64ToAzureAsync(byte[] bytes, string docName, IConnectionManager _connectionManager)
        {
            var response = new BlobStorageResponse();

            var portalkey = _connectionManager.X_Portal_Key_Value;
            var containerName = $"{portalkey}-files".ToLower();
            string fileName;
            if (!string.IsNullOrEmpty(docName))
                containerName = $"{portalkey}-{Path.GetExtension(docName).Replace(".","")}".ToLower();
            if (string.IsNullOrEmpty(docName))
                fileName = $"File_{DateTime.UtcNow.Ticks}_{docName}";
            else
                fileName = $"{Path.GetFileNameWithoutExtension(docName)}_{DateTime.UtcNow.Ticks}{Path.GetExtension(docName)}";

            var contentType = GetMimeTypeForFileExtension(fileName);

            BlobContainerClient container = _blobService.GetBlobContainerClient(containerName);
            await container.CreateIfNotExistsAsync();
            BlobClient blob = container.GetBlobClient(fileName);

            BlobHttpHeaders httpHeaders = new BlobHttpHeaders()
            {
                ContentType = contentType,
                ContentDisposition = "",
            };
            IDictionary<string, string> metadata = new Dictionary<string, string>();
            metadata.Add("docType", Path.GetExtension(docName).Replace(".", ""));


            using (MemoryStream stream = new MemoryStream(bytes))
            {
                await blob.UploadAsync(stream, httpHeaders, metadata);
            }
            if (blob.Uri != null)
            {
                response.uri = blob.Uri.ToString();
                response.fileType = Path.GetExtension(docName).Replace(".", "");
            }
            else
            {
                response.uri = string.Empty;
                response.fileType = "";
            }
            return response;


        }



        public string GetMimeTypeForFileExtension(string filePath)
        {
            const string DefaultContentType = "application/octet-stream";

            var provider = new FileExtensionContentTypeProvider();

            if (!provider.TryGetContentType(filePath, out string contentType))
            {
                contentType = DefaultContentType;
            }

            return contentType;
        }
        public static string GetFileExtensionFromBase64String(string base64String)
        {
            var data = base64String.Substring(0, 5);

            switch (data.ToUpper())
            {
                case "IVBOR":
                    return "png";
                case "/9J/4":
                    return "jpg";
                case "AAAAF":
                    return "mp4";
                case "JVBER":
                    return "pdf";
                case "AAABA":
                    return "ico";
                case "UMFYI":
                    return "rar";
                case "E1XYD":
                    return "rtf";
                case "U1PKC":
                    return "txt";
                case "MQOWM":
                case "77U/M":
                    return "srt";
                default:
                    return string.Empty;
            }
        }

        
       
    }
}
