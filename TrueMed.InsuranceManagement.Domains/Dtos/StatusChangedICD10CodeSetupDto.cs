using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class StatusChangedICD10CodeSetupDto
    {
        public int ICD10CodeID { get; set; }
        public bool? NewStatus { get; set; }
    }
}
