using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domain.QueryModel
{
    public class InsuranceAssignmentQueryModel
    {
        public string? ProviderName { get; set; }
        public string? DisplayName { get; set; }
        public string? InsuranceName { get; set; }
        public string? InsuranceType { get; set; }
        public string? ProviderCode { get; set; }
        public bool? ProviderStatus { get; set; }
    }
}
