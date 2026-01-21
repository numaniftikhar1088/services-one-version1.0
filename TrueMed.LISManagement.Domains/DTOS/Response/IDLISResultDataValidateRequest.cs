using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domains.DTOS.Response
{
    public class IDLISResultDataValidateRequest
    {
        public int RequisitionId { get; set; }
        public string RecordId { get; set; }
    }
}
