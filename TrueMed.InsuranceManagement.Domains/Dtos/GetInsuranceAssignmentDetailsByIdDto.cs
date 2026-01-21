using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domain.Dtos
{
    public class GetInsuranceAssignmentDetailsByIdDto
    {
        public int InsuranceAssignmentId { get; set; }
        public int? ProviderId { get; set; }
        public string? ProviderDisplayName { get; set; }
        public string? ProviderCode { get; set; }
        public int? InsuranceId { get; set; }
        public string? InsuranceType { get; set; }
        public bool? Status { get; set; }
    }
}
