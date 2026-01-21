using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Response
{
    public class GetPatientInsuranceDetailByPatientIdViewModel
    {
        public int PatientInsuranceId { get; set; }
        public int? PatientId { get; set; }
        public int? InsuranceId { get; set; }
        public string? InsuranceName { get; set; }
        public string? InsuranceType { get; set; }
        public int? InsuranceProviderId { get; set; }
        public string? ProviderName { get; set; }
        public string? ProviderCode { get; set; }
        public string? GroupNumber { get; set; }
        public string? PolicyId { get; set; }  
        public string? InsurancePhoneNumbr { get; set; }
        public string SubscriberName { get; internal set; }
        public DateTime? SubscriberDOB { get; internal set; }
        public string ReslationShipToInsured { get; internal set; }
        public DateTime? AccidentDate { get; internal set; }
        public string AccidentType { get; internal set; }
        public string AccidentState { get; internal set; }
    }
}
