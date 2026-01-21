using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class GetOrderInsuranceBriefInfoDto
    {
        public int PatientInsuranceId { get; set; }
        public int? PatientId { get; set; }
        public int? InsuranceId { get; set; }
        public int? InsuranceProviderId { get; set; }
        public string? GroupNumber { get; set; }
        public string? PolicyId { get; set; }
        public string? Sfname { get; set; }
        public string? Slname { get; set; }
        public DateTime? Sdob { get; set; }
        public string? Srelation { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? InsurancePhoneNumbr { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
