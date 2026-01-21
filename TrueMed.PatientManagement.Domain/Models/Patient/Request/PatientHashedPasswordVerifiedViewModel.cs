using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Request
{
    public  class PatientHashedPasswordVerifiedViewModel
    {
        public int PatientLoginId { get; set; }
        public string? LoginPassword { get; set; }
    }
}
