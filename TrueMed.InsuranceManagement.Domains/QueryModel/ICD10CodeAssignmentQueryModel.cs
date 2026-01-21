using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.QueryModel
{
    public class ICD10CodeAssignmentQueryModel
    {
        public string? ICD10Code { get; set; }

        public string? RequisitionType { get; set; }

        public string? Facility { get; set; }
        public string? ICD10CodeDescription { get; set; }
        public string? ReferenceLab { get; set; }
        public bool? Status { get; set; }
        public string? PanelName { get; set; }
    }
}
