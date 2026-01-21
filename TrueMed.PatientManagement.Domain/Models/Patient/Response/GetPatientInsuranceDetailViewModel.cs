using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Response
{
    public class GetPatientInsuranceDetailViewModel
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
        public string? SubscriberName { get; set; }       
        public DateTime? SubscriberDOB { get; set; }
        public string? ReslationShipToInsured { get; set; }
        public string? InsurancePhoneNumbr { get; set; }

        public string BillingType { get; set; }

        /// <summary>
        /// Date of Accident
        /// </summary>
        public DateTime? AccidentDate { get; set; }

        /// <summary>
        /// Type of Accident (Static Dropdown)
        /// </summary>
        public string AccidentType { get; set; }

        /// <summary>
        /// State
        /// </summary>
        public string AccidentState { get; set; }
    }
}
