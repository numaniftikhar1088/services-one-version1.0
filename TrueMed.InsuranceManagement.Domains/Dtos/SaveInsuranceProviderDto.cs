using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class SaveInsuranceProviderDto
    {
        public int InsuranceProviderId { get; set; }
        public string? ProviderName { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? LandPhone { get; set; }
        public string? ProviderCode { get; set; }
        public bool? ProviderStatus { get; set; }
        //public string? CreatedBy { get; set; }
        //public DateTime? CreatedDate { get; set; }
        //public string? UpdatedBy { get; set; }
        //public DateTime? UpdatedDate { get; set; }
        //public string? DeletedBy { get; set; }
        //public DateTime? DeletedDate { get; set; }
        //public bool? isDeleted { get; set; }
    }
}
