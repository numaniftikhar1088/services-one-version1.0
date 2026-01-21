using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domains.DTOS.Request
{
    public class IDResultFileUploadRequest
    {
        public int? TemplateId { get; set; }
        public IFormFile File { get; set; }
    }
}
