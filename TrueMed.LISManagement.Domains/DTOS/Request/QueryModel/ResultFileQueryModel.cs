using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domain.DTOS.Request.QueryModel
{
    public class ResultFileQueryModel
    {
        public string? FileName { get; set; }  
        public string? UploadedDate { get; set; }
        public string? Status { get; set; }
        public string? UploadedBy { get; set; }
        public bool IsArchived { get; set; }
    }
}
