using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.QueryModel
{
    public class ICD10CodeSetupQueryModel
    {
        public string? ICD10Code { get; set; }
        public string? Description { get; set; }
        public bool? Icd10status { get; set; }
    }
}
