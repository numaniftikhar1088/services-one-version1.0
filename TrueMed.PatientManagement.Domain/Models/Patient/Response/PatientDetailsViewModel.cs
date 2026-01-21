using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.PatientManagement.Domain.Models.Patient.Request;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Response
{
    public class PatientDetailsViewModel : Patient.PatientViewModel
    {

    }


    public class PatientDetailsAddressInfoViewModel : PatientAddressInfoViewModel
    {
        public string? FacilityName { get; set; }
    }
}
