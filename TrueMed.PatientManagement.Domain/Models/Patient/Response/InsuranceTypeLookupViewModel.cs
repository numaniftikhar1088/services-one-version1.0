using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Response
{
    public class InsuranceTypeLookupViewModel
    {
        public int InsuranceId { get; set; }
        public string? InsuranceName { get; set; }
    }
}
