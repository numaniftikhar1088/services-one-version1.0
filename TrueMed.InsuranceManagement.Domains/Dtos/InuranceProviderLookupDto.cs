using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class InuranceProviderLookupDto
    {
        public int InuranceProviderId { get; set; }
        public string? ProviderName { get; set; }
        public string? ProviderCode { get; set; }
    }
}
