using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Request.QueryModel
{
    public class SearchPatientRequestQM
    {
        public string? PatientFirstName { get; set; }
        public string? PatientLastName { get; set; }
        public DateTime? DOB { get; set; }
        public string? Gender { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
    }
}
