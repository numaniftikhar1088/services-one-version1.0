using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class SaveRequisitionTypeRequest
    {
        public int ReqTypeId { get; set; }
        public string RequisitionType { get; set; } = null!;
        public string RequisitionTypeName { get; set; } = null!;
        public string? RequisitionColor { get; set; }
        public bool? ReqStatus { get; set; }
    }
    public class ChangeRequisitionTypeStatusRequest
    {
        public int ReqTypeId { get; set; }
        public bool? ReqStatus { get; set; }
    }
}
