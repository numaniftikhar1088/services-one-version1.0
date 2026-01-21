using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.QueryModel
{
    public class InsuranceProviderQueryModel
    {
        public int InsuranceProviderId { get; set; }
        public string? ProviderName { get; set; }
        public string? ProviderCode { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? Phone { get; set; }
        public bool? Status { get; set; }
    }
}
