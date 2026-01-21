using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class SaveInsuranceSetupDto
    {
        public int InsuranceId { get; set; }
        public string? InsuranceType { get; set; }
        public string? InsuranceName { get; set; }
        public bool? InsuranceStatus { get; set; }
        //public string? CreatedBy { get; set; }
        //public DateTime? CreatedDate { get; set; }
        //public string? UpdatedBy { get; set; }
        //public DateTime? UpdatedDate { get; set; }
        //public string? DeletedBy { get; set; }
        //public DateTime? DeletedDate { get; set; }
    }
}
