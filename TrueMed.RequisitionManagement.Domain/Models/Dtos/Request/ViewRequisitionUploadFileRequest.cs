using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class ViewRequisitionUploadFileRequest
    {
        //public IFormFile File { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public string FileLength { get; set; }
        public string ContentType { get; set; }
        public int RequisitionId { get; set; }
        public string RecordId { get; set; }
        public int? FacilityId { get; set; }
    }
}
