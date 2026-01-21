using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class GetInsuranceSetupByIdDto
    {
        public int InsuranceId { get; set; }
        public string? InsuranceType { get; set; }
        public string? InsuranceName { get; set; }
        public bool? InsuranceStatus { get; set; }
    }
}
