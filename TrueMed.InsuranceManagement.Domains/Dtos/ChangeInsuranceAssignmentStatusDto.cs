using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domain.Dtos
{
    public class ChangeInsuranceAssignmentStatusDto
    {
        public int InsuranceAssignmentId { get; set; }
        public bool? NewStatus { get; set; }
    }
}
