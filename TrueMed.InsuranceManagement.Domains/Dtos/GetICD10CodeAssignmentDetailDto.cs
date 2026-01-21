using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class GetICD10CodeAssignmentDetailDto
    {
        public int Icd10assignmentId { get; set; }
        public int? Icd10id { get; set; }
        public string? ICD10Code { get; set; }
        public string? ICD10CodeDescription { get; set; }
        public int? RefLabId { get; set; }
        public string? ReferenceLab { get; set; }
        public string? LabType { get; set; }
        public int? ReqTypeId { get; set; }
        public string? RequisitionType { get; set; }
        public int? FacilityId { get; set; }
        public string? Facility { get; set; }
        public bool? Status { get; set; }
        public int? PanelId { get; set; }
        public string? PanelName { get; set; }
    }
}
