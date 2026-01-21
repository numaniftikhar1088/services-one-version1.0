using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class ICD10CodeLookupDto
    {
        //public int ICD10CodeAssignmentId { get; set; }
        public int ICD10Id { get; set; }
        public string? ICD10Code { get; set; }
        public string? Description { get; set; }
    }
}
