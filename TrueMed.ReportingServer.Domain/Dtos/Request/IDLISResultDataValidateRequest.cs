using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.ReportingServer.Domain.Dtos.Request
{
    public class IDLISResultDataValidateRequest
    {
        public int RequisitionId { get; set; }
        public string RecordId { get; set; }
        public int ReqTypeId { get; set; }
        public int FacilityId { get; set; }
    }
}
