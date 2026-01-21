using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domain.Dtos
{
    public class SaveInsuranceAssignmentDto
    {
        public int InsuranceAssignmentId { get; set; }
        public int? ProviderId { get; set; }
        public string? ProviderDisplayName { get; set; }
        public string? ProviderCode { get; set; }
        public int? InsuranceId { get; set; }
        public string? InsuranceType { get; set; }
        public bool? Status { get; set; }
        public int OptionId { get; set; }
        public string? OptionName { get; set; }
        public string? OptionValue { get; set; }
        //public string? CreatedBy { get; set; }
        //public DateTime? CreatedDate { get; set; }
        //public string? UpdatedBy { get; set; }
        //public DateTime? UpdatedDate { get; set; }
        //public string? DeletedBy { get; set; }
        //public DateTime? DeletedDate { get; set; }
    }
}
