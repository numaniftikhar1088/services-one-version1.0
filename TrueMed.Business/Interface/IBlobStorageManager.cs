using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Request;
using TrueMed.Domain.Models.Response;

namespace TrueMed.Business.Interface
{
    public interface IBlobStorageManager
    {
        Task<BlobStorageResponse> UploadAsync(string containerName, string fileName, IFormFile file);
        Task<BlobStorageResponse> UploadAsync(IFormFile file, IConnectionManager _connectionManager, string fileName = "");
        //Task<BlobStorageResponse> UploadBase64Async(BlobRequest blobRequest);
        Task<Stream> DownloadAsync(string uri);
        Task DeleteAsync(string containerName, string fileName);
        Task<string> FromAzureToBase64(string azureUri);
        Task<string> UploadBase64ToAzureAsync(string patientSignature,string fileName, IConnectionManager _connectionManager);
        Task<BlobStorageResponse> UploadDirectBase64ToAzureAsync(byte[] bytes, string docName, IConnectionManager _connectionManager);

    }
}
