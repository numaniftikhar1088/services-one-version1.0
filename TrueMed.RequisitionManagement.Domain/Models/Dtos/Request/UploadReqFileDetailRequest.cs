using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class UploadReqFileDetailRequest
    {
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public int RequisitionOrderId { get; set; }
        public int RequisitionId { get; set; }
        public string RequisitionType { get; set; }
        public string TypeOfFile { get; set; }
    }
}
