using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class GetICD10CodeSetupBriefInfoDto
    {
        public int Icd10id { get; set; }
        public string Icd10code { get; set; } = null!;
        public string? Description { get; set; }
        public bool? Icd10status { get; set; }
    }
}
