using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.Common
{
    public class ICD10CodeModel
    {
        public string Code { get; set; }
        public string Description { get; set; }
        public int icd10id { get; set; }

    }
}
