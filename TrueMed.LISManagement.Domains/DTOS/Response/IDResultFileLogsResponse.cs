using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domains.DTOS.Response
{
    public class IDResultFileLogsResponse
    {
        public int? RowNumber { get; set; }
        public int? RecordId { get; set; }
        public string? Accession { get; set; }
        public string? PatientName { get; set; }
        public string? ErrorMessage { get; set; }

    }
}
