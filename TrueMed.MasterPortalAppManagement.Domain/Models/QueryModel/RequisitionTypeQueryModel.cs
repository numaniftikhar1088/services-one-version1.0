using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel
{
    public class RequisitionTypeQueryModel
    {
        public string? RequisitionType { get; set; }
        public string? RequisitionTypeName { get; set; }
        public string? RequisitionColor { get; set; }
        public bool? ReqStatus { get; set; }
    }
}
