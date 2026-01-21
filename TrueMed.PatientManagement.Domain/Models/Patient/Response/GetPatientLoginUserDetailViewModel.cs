using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Response
{
    public class GetPatientLoginUserDetailViewModel
    {
        public int PatientLoginId { get; set; }
        public int PatientId { get; set; }
        public string? Email { get; set; }
        public string UserName { get; set; } = null!;
        //public string? LoginPassword { get; set; }
        public string? Mobile { get; set; }
    }
}
