using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.LookupModel
{
    public class PanelSetupLookup
    {
        public int PanelId { get; set; }
        public string? PanelDisplayName { get; set; }
    }
    public class RequisitionTypeLookup
    {
        public int ReqTypeId { get; set; }
        public string? RequisitionTypeName { get; set; }
    }
    public class DepartmentLookup
    {
        public int DeptId { get; set; }
        public string DepartmentName { get; set; }
    }
}
