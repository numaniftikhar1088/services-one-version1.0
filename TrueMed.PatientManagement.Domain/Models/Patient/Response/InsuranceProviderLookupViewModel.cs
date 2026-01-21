using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Response
{
    public class InsuranceProviderLookupViewModel
    {
        public int insuranceProviderId { get; set; }
        public string? ProviderName { get; set; }
    }
}
