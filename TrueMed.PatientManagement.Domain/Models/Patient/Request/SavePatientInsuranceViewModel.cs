using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Request
{
    public class SavePatientInsuranceViewModel
    {
        [Required]
        public int PatientInsuranceId { get; set; }
        [Required]
        public int? PatientId { get; set; }
        [Required]
        public int? InsuranceId { get; set; }
        [Required]
        public int? InsuranceProviderId { get; set; }
        [Required]
        public string? GroupNumber { get; set; }
        [Required]
        public string? PolicyId { get; set; }
        [Required]
        public string? Sfname { get; set; }
        [Required]
        public string? Slname { get; set; }
        [Required]
        public DateTime? Sdob { get; set; }
        [Required]
        public string? Srelation { get; set; }
        [Required]
        public string? InsurancePhoneNumbr { get; set; }
    }
}
