using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domain.Dtos
{
    public class ChangeICD10CodeAssignmentStatusDto
    {
        public int ICD10CodeAssignmentId { get; set; }
        public bool? NewStatus { get; set; }
    }
}
