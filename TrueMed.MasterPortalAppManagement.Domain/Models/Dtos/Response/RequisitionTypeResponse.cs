using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response
{
    public class GetRequisitionTypeResponse
    {
        public int ReqTypeId { get; set; }
        public string RequisitionType { get; set; } = null!;
        public string RequisitionTypeName { get; set; } = null!;
        public string? RequisitionColor { get; set; }
        public bool? ReqStatus { get; set; }
    }
}
