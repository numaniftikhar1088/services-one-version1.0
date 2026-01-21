using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class SaveICD10CodeAssignmentDto
    {
        public int Icd10assignmentId { get; set; }
        public int? Icd10id { get; set; }
        public string icD10Code { get; set; }
        public string icD10CodeDescription { get; set; }
        public int? RefLabId { get; set; }
        public string? LabType { get; set; }
        public int? ReqTypeId { get; set; }
        public int? FacilityId { get; set; }
        public bool? Status { get; set; }
        public int? PanelId { get; set; }
    }
}
