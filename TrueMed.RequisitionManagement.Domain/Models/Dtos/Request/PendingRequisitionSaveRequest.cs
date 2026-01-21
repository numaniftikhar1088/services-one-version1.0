using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class WaitingForSignatureSaveRequest
    {
        public int[] RequisitionIds { get; set; }
        public string Status { get; set; }
        public string PhysicianSignatureUrl { get; set; }
    }
}
