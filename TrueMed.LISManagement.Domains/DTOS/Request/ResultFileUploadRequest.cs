using Microsoft.AspNetCore.Http;

namespace TrueMed.LISManagement.Domain.DTOS.Request
{
    public class ResultFileUploadRequest
    {
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string FileDataType { get; set; }
        public string AzureLink { get; set; }
    }
}
