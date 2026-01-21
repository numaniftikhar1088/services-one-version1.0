using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domain.DTOS.Response
{
    public class ResultFileResponse
    {
        public int Id { get; set; }
        public string? FileName { get; set; }
        public string? FileDataType { get; set; }
        public string? AzureLink { get; set; }
        public string? UploadedDate { get; set; }
        public string? UploadedTime { get; set; }
        public string? Status { get; set; }
        public string? UploadedBy { get; set; }
    }
}
