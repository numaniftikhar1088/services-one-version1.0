using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.QueryModel
{
    public class GetInsuranceAssignmentDetailsQueryModel
    {
        public int ProviderID { get; set; }
        public int InsuranceAssignmentId { get; set; }
        public string? ProviderName { get; set; }
        public int OptionId { get; set; }
        public string? OptionName { get; set; }
        public string? OptionValue { get; set; }
        public string? DisplayName { get; set; }
        public string? TMITCode { get; set; }
        public string? InsuranceName { get; set; }
        public string? InsuranceType { get; set; }
        public bool? Status { get; set; }
    }
}
