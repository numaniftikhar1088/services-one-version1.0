using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class ReferenceLabLookupDto
    {
        public int LabId { get; set; }
        public string? LabDisplayName { get; set; }
        //public int ICD10CodeAssignmentId { get; set; }
        //public int? RefLabId { get; set; }
        //public string? ReferenceLab { get; set; }
        //public string? LabType { get; set; }
    }
}
